const EmptyState = ({ icon, title, description, action }) => (
  <div className="text-center py-16 px-4">
    {icon && <div className="text-6xl mb-4">{icon}</div>}
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
    {description && <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">{description}</p>}
    {action && action}
  </div>
);

export default EmptyState;
