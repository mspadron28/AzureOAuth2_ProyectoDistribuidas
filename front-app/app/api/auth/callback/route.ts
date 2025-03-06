import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      console.error('No se recibió un código de autorización');
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    console.log('🔹 Código recibido:', code);

    const credentials = Buffer.from('client-app:12345').toString('base64');

    // Solicitar el token OAuth2
    const tokenResponse = await fetch('http://127.0.0.1:9000/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://172.191.30.75:3000/api/auth/callback',
      }).toString(),
    });

    console.log('🔹 Respuesta del token:', tokenResponse.status, tokenResponse.statusText);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Error al obtener el token:', errorText);
      return NextResponse.json(
        { error: 'Failed to get token', details: errorText },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Token recibido:', tokenData);

    // Extraer el email desde `sub` en el payload del token
    const tokenPayload = JSON.parse(
      Buffer.from(tokenData.access_token.split('.')[1], 'base64').toString()
    );
    const userEmail = tokenPayload.sub; // 📌 Extraemos el email desde `sub`

    console.log('🔍 Buscando usuario con email:', userEmail);

    // 🔥 Usamos el proxy en lugar de llamar directamente al backend
    const userResponse = await fetch(`http://172.191.30.75:3000/api/proxy/usuarios?email=${userEmail}`);

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('❌ Error al obtener usuario:', errorText);
      return NextResponse.json(
        { error: 'Failed to get user', details: errorText },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    console.log('✅ Usuario encontrado:', userData);

    // Guardar el token en cookies
    const cookieStore = cookies();
    (await cookieStore).set('access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: tokenData.expires_in,
    });

    // Redirigir según el tipo de usuario
    if (userData.tipoUsuario === 'CLIENTE') {
      console.log('🔹 Redirigiendo a dashboard de cliente');
      return NextResponse.redirect(new URL('/cliente/home', request.url), 307);
    } else if (userData.tipoUsuario === 'PROVEEDOR') {
      console.log('🔹 Redirigiendo a dashboard de proveedor');
      return NextResponse.redirect(new URL('/proveedor/home', request.url), 307);
    } else {
      console.error('❌ Tipo de usuario desconocido:', userData.tipoUsuario);
      return NextResponse.json({ error: 'Unknown user type' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('❌ Error inesperado en el callback:', error);
    return NextResponse.json(
      { error: 'Unexpected error', details: error.message },
      { status: 500 }
    );
  }
}
