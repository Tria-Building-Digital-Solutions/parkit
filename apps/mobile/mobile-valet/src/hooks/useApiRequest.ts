import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { messageFromAxios } from '@parkit/shared';

interface ApiRequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

interface UseApiRequestOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  transform?: (data: any) => T;
  cacheTime?: number; // in milliseconds
}

/**
 * Hook para manejar peticiones a la API con caching y estados
 */
export function useApiRequest<T = any>(
  endpoint: string | (() => string),
  options: UseApiRequestOptions<T> = {}
) {
  const [state, setState] = useState<ApiRequestState<T>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const getEndpoint = useCallback(() => {
    return typeof endpoint === 'function' ? endpoint() : endpoint;
  }, [endpoint]);

  const execute = useCallback(
    async (customEndpoint?: string): Promise<T | null> => {
      const targetEndpoint = customEndpoint || getEndpoint();
      
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await api.get(targetEndpoint);
        const transformedData = options.transform 
          ? options.transform(response.data)
          : response.data;

        setState({
          data: transformedData,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });

        if (options.onSuccess) {
          options.onSuccess(transformedData);
        }

        return transformedData;
      } catch (error) {
        const errorMessage = messageFromAxios(error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        if (options.onError) {
          options.onError(errorMessage || 'An error occurred');
        }

        return null;
      }
    },
    [getEndpoint, options]
  );

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      lastFetched: null,
    });
  }, []);

  // Auto-execute if immediate is true
  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  // Auto-refresh based on cache time
  useEffect(() => {
    if (!options.cacheTime || !state.lastFetched) return;

    const timer = setTimeout(() => {
      execute();
    }, options.cacheTime);

    return () => clearTimeout(timer);
  }, [execute, options.cacheTime, state.lastFetched]);

  return {
    ...state,
    execute,
    refetch,
    reset,
    isStale: options.cacheTime 
      ? state.lastFetched 
        ? Date.now() - state.lastFetched.getTime() > options.cacheTime
        : true
      : false,
  };
}

/**
 * Hook para peticiones POST/PUT/DELETE
 */
export function useApiMutation<T = any>(options: {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onSuccessMessage?: string;
  onErrorFallback?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<T | null>(null);

  const mutate = useCallback(
    async (
      method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      endpoint: string,
      data?: any
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        let response;
        switch (method) {
          case 'POST':
            response = await api.post(endpoint, data);
            break;
          case 'PUT':
            response = await api.put(endpoint, data);
            break;
          case 'DELETE':
            response = await api.delete(endpoint);
            break;
          case 'PATCH':
            response = await api.patch(endpoint, data);
            break;
        }

        const result = response.data;
        setLastResult(result);

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = messageFromAxios(err) || options.onErrorFallback || 'An error occurred';
        setError(errorMessage);

        if (options.onError) {
          options.onError(errorMessage);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setLastResult(null);
  }, []);

  return {
    loading,
    error,
    lastResult,
    mutate,
    reset,
  };
}

/**
 * Hook para manejar múltiples peticiones a la API
 */
export function useMultiApiRequest<T = any>(
  endpoints: Record<string, string | (() => string)>,
  options: UseApiRequestOptions<T> = {}
) {
  const [states, setStates] = useState<Record<string, ApiRequestState<T>>>(() => {
    const initial: Record<string, ApiRequestState<T>> = {};
    Object.keys(endpoints).forEach(key => {
      initial[key] = { data: null, loading: false, error: null, lastFetched: null };
    });
    return initial;
  });

  const execute = useCallback(
    async (key: string, customEndpoint?: string): Promise<T | null> => {
      const targetEndpoint = customEndpoint || (typeof endpoints[key] === 'function' ? (endpoints[key] as () => string)() : endpoints[key]);

      setStates(prev => ({
        ...prev,
        [key]: { ...prev[key], loading: true, error: null }
      }));

      try {
        const response = await api.get(targetEndpoint);
        const transformedData = options.transform 
          ? options.transform(response.data)
          : response.data;

        setStates(prev => ({
          ...prev,
          [key]: {
            data: transformedData,
            loading: false,
            error: null,
            lastFetched: new Date(),
          }
        }));

        if (options.onSuccess) {
          options.onSuccess(transformedData);
        }

        return transformedData;
      } catch (error) {
        const errorMessage = messageFromAxios(error);
        setStates(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            loading: false,
            error: errorMessage,
          }
        }));

        if (options.onError) {
          options.onError(errorMessage || 'An error occurred');
        }

        return null;
      }
    },
    [endpoints, options]
  );

  const executeAll = useCallback(async (): Promise<Record<string, T | null>> => {
    const results: Record<string, T | null> = {};
    
    await Promise.all(
      Object.keys(endpoints).map(async (key) => {
        results[key] = await execute(key);
      })
    );

    return results;
  }, [endpoints, execute]);

  const reset = useCallback((key?: string) => {
    if (key) {
      setStates(prev => ({
        ...prev,
        [key]: { data: null, loading: false, error: null, lastFetched: null }
      }));
    } else {
      const resetStates: Record<string, ApiRequestState<T>> = {};
      Object.keys(endpoints).forEach(k => {
        resetStates[k] = { data: null, loading: false, error: null, lastFetched: null };
      });
      setStates(resetStates);
    }
  }, [endpoints]);

  return {
    states,
    execute,
    executeAll,
    reset,
    getState: (key: string) => states[key] || { data: null, loading: false, error: null, lastFetched: null },
  };
}
