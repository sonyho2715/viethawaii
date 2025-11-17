import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full px-4 py-2 border rounded-lg transition-colors
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${props.id}-error` : helpText ? `${props.id}-help` : undefined
            }
            {...props}
          />
        </div>

        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helpText && !error && (
          <p id={`${props.id}-help`} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
