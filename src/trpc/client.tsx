'use client';
// ^-- to make sure we can mount the Provider from a server component
import superjson from 'superjson';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext, createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { useState, useMemo } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

// Create the tRPC context and hooks
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;
let browserTRPCClient: ReturnType<typeof createTRPCClient<AppRouter>> | null = null;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}

function getTRPCClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new client
    return createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
        }),
      ],
    });
  }
  // Browser: reuse the same client
  if (!browserTRPCClient) {
    browserTRPCClient = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
        }),
      ],
    });
  }
  return browserTRPCClient;
}

// Hook to create tRPC options proxy with the client
export function useTRPCOptions() {
  const queryClient = useQueryClient();
  const client = getTRPCClient();

  return useMemo(
    () => createTRPCOptionsProxy<AppRouter>({ client, queryClient }),
    [client, queryClient]
  );
}

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => getTRPCClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}