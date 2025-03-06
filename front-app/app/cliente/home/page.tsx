"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ClienteHome() {
  const router = useRouter();
  const [servicios, setServicios] = useState<any[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showReservarModal, setShowReservarModal] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<any | null>(null);
  const [fechaReserva, setFechaReserva] = useState<string>('');
  const [fechasReservadas, setFechasReservadas] = useState<string[]>([]);

  // Función para obtener las reservas del cliente
  const fetchReservas = async (clienteId: number, token: string) => {
    try {
      const reservasResponse = await fetch(`/api/proxy/reservas/cliente/${clienteId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!reservasResponse.ok) throw new Error('Error al obtener las reservas');
      const reservasData = await reservasResponse.json();
      setReservas(reservasData);
    } catch (error: any) {
      console.error('❌ Error al obtener reservas:', error.message);
      toast.error(error.message);
      setError(error.message);
    }
  };

  // Función para obtener los servicios disponibles
  const fetchServicios = async (token: string) => {
    try {
      const response = await fetch('/api/proxy/servicios', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al obtener los servicios');
      const data = await response.json();
      setServicios(data);
    } catch (error: any) {
      console.error('❌ Error al obtener servicios:', error.message);
      toast.error(error.message);
      setError(error.message);
    }
  };

  // Efecto inicial para autenticación y carga de datos
  useEffect(() => {
    const init = async () => {
      try {
        const tokenRes = await fetch('/api/auth/token', { credentials: 'include' });
        if (!tokenRes.ok) throw new Error('No estás autenticado');
        const { access_token } = await tokenRes.json();
        setToken(access_token);

        const tokenPayload = JSON.parse(
          Buffer.from(access_token.split('.')[1], 'base64').toString()
        );
        const userEmail = tokenPayload.sub;

        const userResponse = await fetch(`/api/proxy/usuarios?email=${userEmail}`);
        if (!userResponse.ok) throw new Error('Error al obtener el usuario');
        const userData = await userResponse.json();

        if (userData.tipoUsuario !== 'CLIENTE') {
          throw new Error('Acceso denegado: No eres un cliente');
        }

        setClienteId(userData.id);
        await fetchReservas(userData.id, access_token);
        await fetchServicios(access_token);
      } catch (error: any) {
        console.error('❌ Error:', error.message);
        toast.error(error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Función para abrir el modal y obtener fechas reservadas
  const handleOpenReservarModal = async (servicio: any) => {
    try {
      setServicioSeleccionado(servicio);
      setFechaReserva('');

      const response = await fetch(`/api/proxy/servicios/${servicio.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al obtener la información del servicio');
      const servicioData = await response.json();

      const fechasReservadasArray = servicioData.reservas.map((reserva: any) => reserva.fechaReserva);
      setFechasReservadas(fechasReservadasArray);
      setShowReservarModal(true);
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      toast.error(error.message);
      setError(error.message);
    }
  };

  // Función para realizar la reserva
  const handleReservar = async () => {
    if (!clienteId || !token || !fechaReserva || !servicioSeleccionado) {
      toast.error('Error: Datos incompletos.');
      return;
    }

    if (fechasReservadas.includes(fechaReserva)) {
      toast.error('La fecha seleccionada ya está reservada. Intenta otra fecha.');
      return;
    }

    try {
      const response = await fetch(`/api/proxy/reservas/${clienteId}/${servicioSeleccionado.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fechaReserva,
          estado: 'PENDIENTE',
        }),
      });
      if (!response.ok) throw new Error('Error al reservar el servicio');

      toast.success('Reserva realizada con éxito');
      setShowReservarModal(false);
      await fetchReservas(clienteId, token);
      await fetchServicios(token);
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      toast.error(error.message);
      setError(error.message);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      router.push('/');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <Button onClick={handleLogout} className="self-end mb-4 bg-red-600 hover:bg-red-700">
        Cerrar Sesión
      </Button>

      {/* Sección de Reservas */}
      <Card className="w-full max-w-3xl mb-6">
        <CardHeader>
          <CardTitle>Mis Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && reservas.length === 0 ? (
            <p className="text-gray-500">No tienes reservas realizadas.</p>
          ) : (
            reservas.map((reserva) => (
              <Card key={reserva.id} className="mb-3 p-4">
                <p><strong>ID de la Reserva:</strong> {reserva.id}</p>
                <p><strong>Cliente ID:</strong> {reserva.clienteId}</p>
                <p><strong>Fecha de reserva:</strong> {reserva.fechaReserva}</p>
                <p><strong>Estado:</strong>{' '}
                  <span
                    className={`px-2 py-1 rounded ${
                      reserva.estado === 'CONFIRMADA'
                        ? 'bg-green-500'
                        : reserva.estado === 'CANCELADA'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    } text-white`}
                  >
                    {reserva.estado}
                  </span>
                </p>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Sección de Servicios */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Servicios Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && servicios.length === 0 ? (
            <p className="text-gray-500">No hay servicios disponibles.</p>
          ) : (
            servicios.map((servicio) => (
              <Card key={servicio.id} className="mb-3 p-4">
                <h3 className="text-xl font-semibold">{servicio.nombre}</h3>
                <p className="text-gray-600">{servicio.descripcion}</p>
                <p className="text-green-600 font-bold mt-2">${servicio.precio}</p>
                <Button
                  onClick={() => handleOpenReservarModal(servicio)}
                  className="mt-2 bg-green-500 hover:bg-green-600"
                >
                  Reservar
                </Button>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Modal para Reservar */}
      {showReservarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="p-6 w-96">
            <CardHeader>
              <CardTitle>Reservar {servicioSeleccionado?.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="date"
                value={fechaReserva}
                onChange={(e) => setFechaReserva(e.target.value)}
                className="w-full p-2 border rounded bg-gray-100 text-black mb-2"
                required
              />
              {fechasReservadas.includes(fechaReserva) && (
                <p className="text-red-500">❌ Esta fecha ya está reservada</p>
              )}
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handleReservar}
                  className="bg-green-500 hover:bg-green-600"
                  disabled={fechasReservadas.includes(fechaReserva)}
                >
                  Confirmar Reserva
                </Button>
                <Button
                  onClick={() => setShowReservarModal(false)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}