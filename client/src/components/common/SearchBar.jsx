import { useEffect, useState } from 'react';

const SearchBar = ({ value = '', onChange, onSearch, placeholder = 'Search...', className = '' }) => {
  const [inputValue, setInputValue] = useState(value);

  // Sync when parent resets value (e.g. "Clear filters")
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(inputValue);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex ${className}`}>
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {/* Inline clear button */}
        {inputValue && (
          <button
            type="button"
            onClick={() => { setInputValue(''); if (onChange) onChange(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-primary-700 text-white font-medium text-sm rounded-r-lg hover:bg-primary-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
