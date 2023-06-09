'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { forwardRef, ReactNode, DetailedHTMLProps, InputHTMLAttributes } from 'react';

type FormInputProps = {
  children?: ReactNode;
  id?: string;
  name: string;
  label: string;
  value: string | number;
  className?: string;
  invalid?: boolean;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export type Ref = HTMLSelectElement;

const Select = forwardRef<Ref, FormInputProps>(({ children, name = '', label = '', value = '', invalid = false, className, ...props }, ref) => {
  const isInvalid = invalid && !value;
  return (
    <>
      <label htmlFor={`${name}-form`} className="input-label flex items-center">
        <span className="grow">
          {label} {props.required && <span className="text-gray-600">*</span>}
        </span>
      </label>
      <select
        ref={ref}
        name={name}
        id={`${name}-form`}
        className={`${isInvalid && '!border-red-400'} mt-1 input-field py-1.5 px-2 focus:outline-none ${className}`}
        value={value}
        data-lpignore="true"
        data-form-type="other"
        {...props}
      >
        {children}
      </select>
      {isInvalid && (
        <p className="text-xs flex items-center gap-1 mt-1 text-red-400">
          <ExclamationTriangleIcon className="h-4" /> this field is required
        </p>
      )}
    </>
  );
});

Select.displayName = 'Select';

export default Select;
