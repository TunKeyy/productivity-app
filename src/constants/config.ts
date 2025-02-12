const getEnvVar = (name: string): string => {
  const value = process.env[`EXPO_PUBLIC_${name}`];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const SUPABASE_URL = getEnvVar('SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnvVar('SUPABASE_ANON_KEY');

export const APP_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 30,
  APP_NAME: 'Productivity',
}; 