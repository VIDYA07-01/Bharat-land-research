import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { successMessage, errorMessage, onSuccess, onError } = options;
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      if (successMessage) toast.success(successMessage);
      if (onSuccess) onSuccess(result.data);
      return result.data;
    } catch (err) {
      const message = err.response?.data?.error || errorMessage || 'Something went wrong';
      setError(message);
      toast.error(message);
      if (onError) onError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};

export default useApi;
