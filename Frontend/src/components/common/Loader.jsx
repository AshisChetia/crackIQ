const Loader = ({ size = 'md', text, fullPage = false }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-[2px]',
    md: 'w-8 h-8 border-[2px]',
    lg: 'w-12 h-12 border-[3px]',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} rounded-full border-light/10 border-t-light animate-spin-slow`} />
      {text && <span className="text-xs text-light-muted font-mono tracking-wider">{text}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div id="global-loader" className="fixed inset-0 bg-dark z-[1000] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div id="global-loader">{spinner}</div>;
};

export default Loader;
