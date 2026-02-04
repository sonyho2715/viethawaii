import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession() {
    return { data: null, status: 'unauthenticated' };
  },
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Global fetch mock
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
