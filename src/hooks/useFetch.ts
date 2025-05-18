import { useEffect, useState } from "react";

type FetchFunction<T> = () => Promise<T>;

interface UseFetchState<T> {
  isFetching: boolean;
  fetchedData: T | null;
  error: Error | null;
}

export function useFetch<T>(
  fetchFn: FetchFunction<T>,
  initialValue: T
): UseFetchState<T> {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<T | null>(initialValue);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await fetchFn();
        setFetchedData(data);
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [fetchFn]);

  return { isFetching, error, fetchedData };
}
