import { useEffect, useRef, useState } from "react";

interface Props<T> {
  key: string;
  enabled?: boolean;
  fetcher: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  onLoading?: (isLoading: boolean) => void;
}

interface FetchState<T> {
  data: T | null;
  error: unknown;
  isLoading: boolean;
}

export const useFetch = <T>({
  key,
  enabled = true,
  fetcher,
  onSuccess,
  onError,
  onLoading,
}: Props<T>) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  const isMounted = useRef<boolean>(true);
  useEffect(() => {
    isMounted.current = true;

    if (!key || !enabled) {
      if (isMounted.current) {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
      return () => {
        isMounted.current = false;
      };
    }

    const fetchData = async () => {
      if (isMounted.current) {
        setState((prev) => ({ ...prev, isLoading: true }));
      }

      onLoading?.(true);

      try {
        const result = await fetcher();

        if (isMounted.current) {
          setState({ data: result, error: null, isLoading: false });
          onSuccess?.(result);
        }
      } catch (error) {
        if (isMounted.current) {
          setState({ data: null, error, isLoading: false });
          onError?.(error);
        }
      } finally {
        if (isMounted.current) {
          onLoading?.(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, [key, enabled]);

  return {
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
  };
};
