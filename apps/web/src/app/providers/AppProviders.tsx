import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";
import { LocaleProvider } from "../../features/i18n";
import {
  VisualizationRepositoryProvider,
  createDefaultVisualizationRepository,
  type VisualizationRepository,
} from "../../features/visualization/repository";
import { ThemeModeProvider } from "../theme/ThemeModeProvider";

type AppProvidersProps = PropsWithChildren<{
  repository?: VisualizationRepository;
  queryClient?: QueryClient;
}>;

export const AppProviders = ({
  children,
  repository,
  queryClient,
}: AppProvidersProps) => {
  const [client] = useState(
    () =>
      queryClient ??
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const [resolvedRepository] = useState(
    () => repository ?? createDefaultVisualizationRepository(),
  );

  return (
    <QueryClientProvider client={client}>
      <LocaleProvider>
        <VisualizationRepositoryProvider repository={resolvedRepository}>
          <ThemeModeProvider>
            {children}
          </ThemeModeProvider>
        </VisualizationRepositoryProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
};
