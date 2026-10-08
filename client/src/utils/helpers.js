export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const truncate = (text, maxLength = 150) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const getStatusBadgeClass = (status) => {
  const map = {
    published: 'badge-green',
    approved: 'badge-green',
    pending: 'badge-yellow',
    rejected: 'badge-red',
    draft: 'badge bg-gray-100 text-gray-600',
    active: 'badge-green',
    completed: 'badge-blue',
    proposed: 'badge-purple',
    under_review: 'badge-orange',
    open: 'badge-green',
    closed: 'badge-red',
    upcoming: 'badge-blue',
  };
  return map[status] || 'badge bg-gray-100 text-gray-600';
};

export const getRoleBadgeClass = (role) => {
  const map = {
    public: 'badge bg-gray-100 text-gray-700',
    researcher: 'badge-blue',
    government: 'badge-green',
    admin: 'badge-red',
  };
  return map[role] || 'badge bg-gray-100 text-gray-600';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
};

export const buildQueryString = (params) => {
  const filtered = Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined);
  return new URLSearchParams(Object.fromEntries(filtered)).toString();
};

export const fileSizeFormat = (bytes) => {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
