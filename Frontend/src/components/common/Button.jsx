const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  id,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full cursor-pointer transition-all duration-150 whitespace-nowrap relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none';

  const variants = {
    primary: 'text-dark bg-light hover:bg-light/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(250,250,250,0.12)] active:translate-y-0',
    ghost: 'text-light-2 bg-transparent hover:text-light hover:bg-light/[0.06]',
    outline: 'text-light bg-transparent border border-border-subtle hover:border-border-hover hover:bg-light/[0.04] hover:-translate-y-0.5',
    danger: 'text-white bg-danger hover:bg-red-600 hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[0.8rem]',
    md: 'px-7 py-3 text-[0.9rem]',
    lg: 'px-9 py-4 text-base',
  };

  return (
    <button
      type={type}
      id={id}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin-slow" />
      )}
      {!loading && icon && <span className="flex items-center">{icon}</span>}
      {children && <span>{children}</span>}
      {!loading && iconRight && <span className="flex items-center">{iconRight}</span>}
    </button>
  );
};

export default Button;
