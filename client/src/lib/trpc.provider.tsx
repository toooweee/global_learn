import { createTRPCReact, httpBatchLink, httpLink, isNonJsonSerializable, splitLink } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppRouter } from '@global_learn/api/dist/src/trpc/@generated/server';

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnReconnect: false,
    },
  },
});

const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition: (op) => isNonJsonSerializable(op.input),
      true: httpLink({
        url: 'http://localhost:3000/trpc',
        headers: async () => {
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          return token ? { authorization: `Bearer ${token}` } : {};
        },
        fetch: async (input, init) => {
          return fetch(input, { ...init, credentials: 'include' as RequestCredentials });
        },
      }),
      false: httpBatchLink({
        url: 'http://localhost:3000/trpc',
        headers: async () => {
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          return token ? { authorization: `Bearer ${token}` } : {};
        },
        fetch: async (input, init) => {
          return fetch(input, { ...init, credentials: 'include' as RequestCredentials });
        },
      }),
    }),
  ],
});

const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default TrpcProvider;
