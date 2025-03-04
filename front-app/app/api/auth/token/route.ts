import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const token = (await cookies()).get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No estás autenticado' }, { status: 401 });
  }

  return NextResponse.json({ access_token: token });
}
