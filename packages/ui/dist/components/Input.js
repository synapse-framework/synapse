import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../utils/index.js';
export const Input = ({ value = '', placeholder, onChange, onBlur, onFocus, disabled = false, error = false, errorMessage, helperText, label, type = 'text', leftIcon, rightIcon, clearable = false, className, size = 'md', ...props }) => {
    const baseClasses = 'block w-full rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0';
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-base',
        lg: 'px-4 py-3 text-lg'
    };
    const stateClasses = error
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white';
    const handleClear = () => {
        if (onChange) {
            onChange('');
        }
    };
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label })), _jsxs("div", { className: "relative", children: [leftIcon && (_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("span", { className: "text-gray-400", children: leftIcon }) })), _jsx("input", { type: type, value: value, placeholder: placeholder, onChange: (e) => onChange?.(e.target.value), onBlur: onBlur, onFocus: onFocus, disabled: disabled, className: cn(baseClasses, sizeClasses[size], stateClasses, disabledClasses, leftIcon && 'pl-10', (rightIcon || clearable) && 'pr-10', className), ...props }), (rightIcon || clearable) && (_jsxs("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: [clearable && value && (_jsx("button", { type: "button", onClick: handleClear, className: "text-gray-400 hover:text-gray-600", children: _jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })), rightIcon && !clearable && (_jsx("span", { className: "text-gray-400", children: rightIcon }))] }))] }), error && errorMessage && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errorMessage })), helperText && !error && (_jsx("p", { className: "mt-1 text-sm text-gray-500", children: helperText }))] }));
};
//# sourceMappingURL=Input.js.map