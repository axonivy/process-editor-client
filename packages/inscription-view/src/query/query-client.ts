import { QueryClient } from '@tanstack/react-query';

export const initQueryClient = () => {
  return new QueryClient();
};

export const genQueryKey = (...args: unknown[]) => {
  return ['inscription', ...args];
};
