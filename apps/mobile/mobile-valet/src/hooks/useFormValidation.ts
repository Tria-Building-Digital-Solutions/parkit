import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string | null;
}

interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Hook para manejar validación de formularios de forma reutilizable
 */
export function useFormValidation(
  initialValues: Record<string, string> = {},
  validationRules: ValidationRules = {},
  options: UseFormValidationOptions = {}
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((name: string, value: string): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || value.trim() === '')) {
      return 'This field is required';
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') {
      return null;
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [validationRules]);

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isFormValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName] || '');
      newErrors[fieldName] = error;
      if (error) isFormValid = false;
    });

    setErrors(newErrors);
    setIsValid(isFormValid);
    return isFormValid;
  }, [values, validationRules, validateField]);

  const setValue = useCallback((name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Validate on change if enabled
    if (options.validateOnChange && touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    // Update overall validity
    const newErrors = { ...errors };
    if (touched[name]) {
      newErrors[name] = validateField(name, value);
    }
    const hasErrors = Object.values(newErrors).some(error => error !== null);
    setIsValid(!hasErrors);
  }, [touched, errors, options.validateOnChange, validateField]);

  const setFieldTouched = useCallback((name: string, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));

    // Validate on blur if enabled
    if (options.validateOnBlur && isTouched) {
      const error = validateField(name, values[name] || '');
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [values, options.validateOnBlur, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsValid(false);
  }, [initialValues]);

  const resetField = useCallback((name: string) => {
    setValues(prev => ({ ...prev, [name]: initialValues[name] || '' }));
    setErrors(prev => ({ ...prev, [name]: null }));
    setTouched(prev => ({ ...prev, [name]: false }));
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setFieldTouched,
    validateForm,
    validateField,
    reset,
    resetField,
  };
}

/**
 * Validadores comunes para reutilizar
 */
export const commonValidators = {
  required: { required: true },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value.includes('@')) return 'Invalid email address';
      return null;
    },
  },
  phone: {
    required: true,
    pattern: /^\+?[1-9]\d{1,14}$/,
    custom: (value: string) => {
      if (value.length < 10) return 'Phone number must be at least 10 digits';
      return null;
    },
  },
  plate: {
    required: true,
    minLength: 5,
    maxLength: 10,
    pattern: /^[A-Z0-9-]+$/,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    custom: (value: string) => {
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return null;
    },
  },
};
