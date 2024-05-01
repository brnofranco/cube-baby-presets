import { useRouter } from "next/router";
import { shake } from "radash";
import { useEffect, useState } from "react";

interface Filter {
  search: string;
  modelId: string;
  userId: string;
}

export const usePresetsFilters = () => {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [filter, setFilter] = useState<Filter>({
    search: "",
    modelId: "all",
    userId: "all",
  });

  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      setFilter({
        search: router.query.search?.toString() ?? "",
        modelId: router.query.modelId?.toString() ?? "all",
        userId: router.query.userId?.toString() ?? "all",
      });
    }
  }, [router.isReady, router.query]);

  const setFilterWithQueryParam = (callback: (oldValue: Filter) => Filter) => {
    setFilter((currentValue) => {
      const newValue = callback(currentValue);

      if (isRouterReady) {
        router.replace({
          query: shake(newValue, (value) => !value || value === "all"),
        });
      }

      return newValue;
    });
  };

  return {
    filter,
    setFilter: setFilterWithQueryParam,
  };
};
