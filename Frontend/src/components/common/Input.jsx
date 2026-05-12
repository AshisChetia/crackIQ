import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  id,
  name,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-light-2 uppercase tracking-wide">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div
        className={`flex items-center gap-2 px-4 py-3 bg-dark-2 border rounded-[10px] transition-all duration-150
          ${error
            ? 'border-danger'
            : focused
              ? 'border-border-active bg-dark-3 shadow-[0_0_0_3px_rgba(250,250,250,0.04)]'
              : 'border-border-subtle'
          }`}
      >
        {icon && (
          <span className={`flex text-light-muted transition-colors duration-150 ${focused ? 'text-light-2' : ''}`}>
            {icon}
          </span>
        )}
        <input
          type={inputType}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent border-none outline-none font-sans text-[0.9rem] text-light placeholder:text-light-dim w-full"
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center text-light-muted hover:text-light-2 cursor-pointer p-1 rounded transition-colors duration-150 bg-transparent border-none"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-[0.78rem] text-danger animate-fade-in-up">{error}</span>
      )}
    </div>
  );
};

export default Input;
