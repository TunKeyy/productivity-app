import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { session } = useAuth();
  
  // Immediately redirect based on auth state
  if (session) {
    console.log('session', session);
    return <Redirect href="/home" />;
  }
  return <Redirect href="/(auth)/login" />;
} 