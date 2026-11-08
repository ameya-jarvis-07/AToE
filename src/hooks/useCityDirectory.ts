import { useEffect, useState } from "react";
import type { CityRecord } from "../types";

export function useCityDirectory() {
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/data/cities.json")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`City directory could not be loaded (${response.status}).`);
        }
        return (await response.json()) as CityRecord[];
      })
      .then((items) => {
        if (!cancelled) setCities(items);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof Error
              ? reason.message
              : "City directory could not be loaded.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { cities, error };
}
