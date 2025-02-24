'use client'

import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Icon } from '@iconify/react';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';

// Registrar el idioma español
registerLocale('es', es);
setDefaultLocale('es');

// Props para el CustomDatePicker
interface CustomDatePickerProps {
  label: string;
  selected: Date;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  isInvalid?: boolean;
  errorMessage?: string;
  dateFormat?: string;
}

// Componente de input personalizado para DatePicker
const DatePickerInput = forwardRef(({ value, onClick, onChange, label, isInvalid, errorMessage }: any, ref: any) => (
  <div className="w-full">
    <div className="flex flex-col">
      <label className="text-sm text-gray-400 mb-1">{label}</label>
      <div 
        onClick={onClick}
        className={`cursor-pointer flex items-center px-3 py-2 rounded-lg border ${isInvalid ? 'border-red-500' : 'border-gray-600'} bg-gray-800`}
      >
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder="dd/MM/yyyy"
          className="bg-transparent text-gray-200 w-full outline-none cursor-pointer"
          readOnly
        />
        <Icon icon="solar:calendar-bold" className="text-gray-400 ml-2" width={20} />
      </div>
    </div>
    {isInvalid && errorMessage && (
      <span className="text-red-400 text-sm mt-1">{errorMessage}</span>
    )}
  </div>
));

DatePickerInput.displayName = 'DatePickerInput';

// Componente principal CustomDatePicker
const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  selected,
  onChange,
  minDate,
  maxDate,
  isInvalid = false,
  errorMessage = '',
  dateFormat = "dd/MM/yyyy"
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={dateFormat}
      minDate={minDate}
      maxDate={maxDate}
      customInput={
        <DatePickerInput 
          label={label} 
          isInvalid={isInvalid}
          errorMessage={errorMessage}
        />
      }
    />
  );
};

// Estilos globales para el DatePicker (puedes incluirlos en globals.css)
export const datePickerStyles = `
  .react-datepicker {
    background-color: #1f2937 !important;
    border-color: #4b5563 !important;
    color: #e5e7eb !important;
  }
  .react-datepicker__header {
    background-color: #111827 !important;
    border-color: #4b5563 !important;
  }
  .react-datepicker__current-month,
  .react-datepicker__day-name,
  .react-datepicker-time__header {
    color: #e5e7eb !important;
  }
  .react-datepicker__day {
    color: #e5e7eb !important;
  }
  .react-datepicker__day:hover {
    background-color: #3b82f6 !important;
  }
  .react-datepicker__day--selected {
    background-color: #3b82f6 !important;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #3b82f6 !important;
  }
  .react-datepicker__day--outside-month {
    color: #6b7280 !important;
  }
  .react-datepicker__navigation {
    top: 8px;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #9ca3af !important;
  }
  .react-datepicker-wrapper {
    width: 100%;
  }
`;

export default CustomDatePicker;