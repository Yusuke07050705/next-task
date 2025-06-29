import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

export const useFetch = <T = any>(url: string | null) => {
  const { token } = useSupabaseSession();

  const fetcher = (url: string) => 
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ?? "",
      },
  }).then((res) => res.json());

  const { data, error, isLoading } = useSWR<T>( token && url ? url: null, fetcher);

  return{
    data,
    error,
    isLoading
  };
};