const LoadingSpinner = ({ size = 'md', text = '', fullPage = false }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12', xl: 'h-16 w-16' };

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <div className={`${sizes.xl} border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin mx-auto`} />
          {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin`} />
      {text && <span className="text-gray-500 text-sm">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
