import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // 🔥 Eliminar la cookie asegurando que expira inmediatamente
  (await cookies()).set('access_token', '', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expira de inmediato
  });

  return NextResponse.json({ message: 'Logout exitoso' }, { status: 200 });
}
