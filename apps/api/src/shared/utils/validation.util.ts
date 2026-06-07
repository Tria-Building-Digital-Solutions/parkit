/**
 * Utility functions for validation and error handling
 */

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates required fields
 */
export function validateRequired(value: unknown, fieldName: string): void {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED');
  }
}

/**
 * Validates string length
 */
export function validateLength(
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): void {
  if (min && value.length < min) {
    throw new ValidationError(
      `${fieldName} must be at least ${min} characters`,
      fieldName,
      'MIN_LENGTH'
    );
  }
  if (max && value.length > max) {
    throw new ValidationError(
      `${fieldName} must be no more than ${max} characters`,
      fieldName,
      'MAX_LENGTH'
    );
  }
}

/**
 * Validates email format
 */
export function validateEmail(email: string, fieldName: string = 'email'): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', fieldName, 'INVALID_EMAIL');
  }
}

/**
 * Validates phone number format
 */
export function validatePhone(phone: string, fieldName: string = 'phone'): void {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone)) {
    throw new ValidationError('Invalid phone number format', fieldName, 'INVALID_PHONE');
  }
}

/**
 * Validates that a value is one of allowed options
 */
export function validateEnum<T>(
  value: unknown,
  allowedValues: T[],
  fieldName: string
): asserts value is T {
  if (!allowedValues.includes(value as T)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`,
      fieldName,
      'INVALID_ENUM'
    );
  }
}

/**
 * Validates date format and range
 */
export function validateDate(
  date: string,
  fieldName: string,
  minDate?: Date,
  maxDate?: Date
): void {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new ValidationError('Invalid date format', fieldName, 'INVALID_DATE');
  }

  if (minDate && parsedDate < minDate) {
    throw new ValidationError(
      `${fieldName} cannot be before ${minDate.toISOString()}`,
      fieldName,
      'DATE_TOO_EARLY'
    );
  }

  if (maxDate && parsedDate > maxDate) {
    throw new ValidationError(
      `${fieldName} cannot be after ${maxDate.toISOString()}`,
      fieldName,
      'DATE_TOO_LATE'
    );
  }
}

/**
 * Validates numeric value
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number
): void {
  const num = Number(value);
  if (isNaN(num)) {
    throw new ValidationError(`${fieldName} must be a number`, fieldName, 'INVALID_NUMBER');
  }

  if (min !== undefined && num < min) {
    throw new ValidationError(
      `${fieldName} must be at least ${min}`,
      fieldName,
      'NUMBER_TOO_SMALL'
    );
  }

  if (max !== undefined && num > max) {
    throw new ValidationError(
      `${fieldName} must be no more than ${max}`,
      fieldName,
      'NUMBER_TOO_LARGE'
    );
  }
}

/**
 * Validates license plate format (Costa Rica)
 */
export function validatePlate(plate: string, fieldName: string = 'plate'): void {
  const cleanPlate = plate.trim().toUpperCase();
  
  // Allow various Costa Rica plate formats:
  // 6 digits: 123456
  // 3 letters + 3 numbers: ABC-123
  // 3 letters + 4 numbers: ABC-1234
  // 2 letters + 4 numbers: AB-1234
  // Any alphanumeric with 5-7 characters
  const plateRegex = /^(\d{6}|[A-Z]{3}-\d{3,4}|[A-Z]{2}-\d{4}|[A-Z0-9]{5,7})$/;
  
  if (!plateRegex.test(cleanPlate)) {
    throw new ValidationError('Invalid license plate format', fieldName, 'INVALID_PLATE');
  }
}

/**
 * Batch validation - runs multiple validations and collects all errors
 */
export function validateBatch(validators: Array<() => void>): void {
  const errors: ValidationError[] = [];
  
  for (const validator of validators) {
    try {
      validator();
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push(error);
      } else {
        throw error;
      }
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError(
      `Validation failed: ${errors.map(e => e.message).join(', ')}`,
      undefined,
      'BATCH_VALIDATION_FAILED'
    );
  }
}
