'use client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:8080/oauth2/authorization/client-app';
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96 text-center'>
        <h1 className='text-3xl font-bold mb-4 text-black'>Bienvenido</h1>
        <p className='text-gray-600 mb-6'>Por favor, inicia sesión o regístrate para continuar.</p>

        <div className='space-y-4'>
          <button
            onClick={handleLogin}
            className='w-full bg-blue-500 text-white p-2 rounded cursor-pointer'
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => router.push('/auth')}
            className='w-full bg-green-500 text-white p-2 rounded cursor-pointer'
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}
