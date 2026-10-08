import { formatNumber } from '../../utils/helpers';

const StatCard = ({ icon, label, value, color = 'blue', trend, suffix = '' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    red: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400',
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {typeof value === 'number' ? formatNumber(value) : value}{suffix}
          </p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl text-2xl ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
