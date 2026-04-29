import { useState, useCallback } from 'react';

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface UseAsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
}

/**
 * Hook para manejar operaciones asíncronas con estados de loading, error y success
 */
export function useAsyncOperation<T = any>(options: UseAsyncOperationOptions = {}) {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(
    async (asyncFunction: () => Promise<T>): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null, success: false }));

      try {
        const result = await asyncFunction();
        setState({
          data: result,
          loading: false,
          error: null,
          success: true,
        });
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }

        if (options.resetOnSuccess) {
          setTimeout(() => {
            setState(prev => ({ ...prev, success: false }));
          }, 2000);
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          success: false,
        }));

        if (options.onError) {
          options.onError(errorMessage);
        }

        return null;
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError,
  };
}

/**
 * Hook para manejar múltiples operaciones asíncronas
 */
export function useMultiAsyncOperation<T = any>(options: UseAsyncOperationOptions = {}) {
  const [operations, setOperations] = useState<Record<string, AsyncOperationState<T>>>({});

  const execute = useCallback(
    async (key: string, asyncFunction: () => Promise<T>): Promise<T | null> => {
      setOperations(prev => ({
        ...prev,
        [key]: { data: null, loading: true, error: null, success: false }
      }));

      try {
        const result = await asyncFunction();
        setOperations(prev => ({
          ...prev,
          [key]: { data: result, loading: false, error: null, success: true }
        }));
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setOperations(prev => ({
          ...prev,
          [key]: { data: null, loading: false, error: errorMessage, success: false }
        }));

        if (options.onError) {
          options.onError(errorMessage);
        }

        return null;
      }
    },
    [options]
  );

  const reset = useCallback((key?: string) => {
    if (key) {
      setOperations(prev => ({
        ...prev,
        [key]: { data: null, loading: false, error: null, success: false }
      }));
    } else {
      setOperations({});
    }
  }, []);

  const clearError = useCallback((key?: string) => {
    if (key) {
      setOperations(prev => ({
        ...prev,
        [key]: { ...prev[key], error: null }
      }));
    } else {
      setOperations(prev => 
        Object.keys(prev).reduce((acc, k) => ({
          ...acc,
          [k]: { ...prev[k], error: null }
        }), {})
      );
    }
  }, []);

  return {
    operations,
    execute,
    reset,
    clearError,
    getOperation: (key: string) => operations[key] || { data: null, loading: false, error: null, success: false },
  };
}
