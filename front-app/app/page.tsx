'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, CalendarCheck, Link } from 'lucide-react'; // Importamos íconos de Lucide React

export default function HomePage() {
  const router = useRouter();

  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:8080/oauth2/authorization/client-app';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex flex-col lg:flex-row">
      {/* Sección izquierda: Misión, Visión y Beneficios */}
      <div className="lg:w-1/2 p-8 flex flex-col justify-center items-center">
        <h1 className="text-5xl font-extrabold text-center drop-shadow-lg mb-6">
          Bienvenido a <span className="text-yellow-300">ServiPro</span>
        </h1>
        <p className="text-lg text-center text-gray-100 max-w-md mb-8">
          La plataforma que une a proveedores y clientes para hacer realidad tus proyectos.
        </p>

        {/* Contenedor de tarjetas: 2 arriba, 1 abajo */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta de Misión */}
          <Card className="bg-white/10 backdrop-blur-md text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Facilitar la conexión entre proveedores de servicios y clientes, ofreciendo una plataforma sencilla, confiable y eficiente.
              </p>
            </CardContent>
          </Card>

          {/* Tarjeta de Visión */}
          <Card className="bg-white/10 backdrop-blur-md text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Ser la solución líder en la gestión de servicios, empoderando a proveedores y clientes en un entorno digital innovador.
              </p>
            </CardContent>
          </Card>

          {/* Tarjeta de Beneficios - Abajo y más ancha */}
          <Card className="md:col-span-2 bg-white/10 backdrop-blur-md text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">¿Qué lograrás?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <User className="w-6 h-6 mr-3 text-yellow-300 flex-shrink-0" />
                  <span>Proveedores: Publica tus servicios y gestiona reservas fácilmente.</span>
                </li>
                <li className="flex items-start">
                  <CalendarCheck className="w-6 h-6 mr-3 text-green-300 flex-shrink-0" />
                  <span>Clientes: Encuentra y reserva servicios con total confianza.</span>
                </li>
                <li className="flex items-start">
                  <Link className="w-6 h-6 mr-3 text-blue-300 flex-shrink-0" />
                  <span>Conexión directa: Acepta o cancela reservas en tiempo real.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sección derecha: Inicio de Sesión y Registro */}
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-white text-gray-900 shadow-2xl rounded-xl transform hover:scale-105 transition-transform duration-300">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-indigo-700">
              Únete a ServiPro
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Inicia sesión o regístrate para comenzar
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md"
            >
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => router.push('/auth')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md"
            >
              Registrarse
            </Button>
            <p className="text-center text-sm text-gray-500">
              Conecta con miles de servicios y oportunidades hoy mismo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}