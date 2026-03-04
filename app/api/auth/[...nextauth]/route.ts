import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Required for static export (hybrid app) - auth uses Supabase directly
export async function generateStaticParams() {
  return [
    { nextauth: ['signin'] },
    { nextauth: ['callback'] },
    { nextauth: ['csrf'] },
    { nextauth: ['session'] },
    { nextauth: ['providers'] },
  ];
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };