/**
 * Index Page - Authentication Check & Redirect
 * Redirects to login if not authenticated, otherwise to tabs
 */

import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect to tabs if authenticated
  return <Redirect href="/(tabs)" />;
}
