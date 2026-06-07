"use client";

import { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
  className = '',
}: FormModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className={`w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  className?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  value,
  onChange,
  options,
  className = '',
}: FormFieldProps) {
  const [internalValue, setInternalValue] = useState(value?.toString() || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const inputClasses = `
    w-full px-3 py-2 border rounded-md shadow-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={internalValue}
            onChange={handleChange}
            disabled={disabled}
            className={inputClasses}
            aria-label={label}
            id={name}
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={internalValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={3}
            className={inputClasses}
            id={name}
            aria-label={label}
          />
        );

      default:
        return (
          <input
            name={name}
            type={type}
            value={internalValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClasses}
            id={name}
            aria-label={label}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label 
        className="block text-sm font-medium text-gray-700 mb-1"
        htmlFor={name}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export interface FormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saveText?: string;
  cancelText?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormActions({
  onCancel,
  onSave,
  saveText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  disabled = false,
  className = '',
}: FormActionsProps) {
  return (
    <div className={`flex items-center justify-end gap-3 ${className}`}>
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={loading || disabled}
        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}
        {saveText}
      </button>
    </div>
  );
}
