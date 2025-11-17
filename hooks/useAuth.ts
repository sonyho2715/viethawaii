import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  userId: string;
  email: string;
  role: string;
}

export function useAuth(requireAuth = true, requireAdmin = false) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');

        if (response.ok) {
          const result = await response.json();

          if (result.success && result.user) {
            const userData = result.user;

            if (requireAdmin && userData.role !== 'admin') {
              router.push('/admin/login');
              return;
            }

            setUser({
              userId: userData.id,
              email: userData.email,
              role: userData.role
            });
          } else {
            if (requireAuth) {
              router.push('/admin/login');
            }
          }
        } else {
          if (requireAuth) {
            router.push('/admin/login');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (requireAuth) {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [requireAuth, requireAdmin, router]);

  return { user, loading, isAuthenticated: !!user };
}
