'use client';
import { useEffect, useState } from 'react';

export default function ClienteHome() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Estado para modal de reserva
  const [showReservarModal, setShowReservarModal] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<any | null>(null);
  const [fechaReserva, setFechaReserva] = useState<string>('');
  const [fechasReservadas, setFechasReservadas] = useState<string[]>([]);

  const fetchReservas = async (clienteId: number, token: string) => {
    console.log('gola');
    try {
      const reservasResponse = await fetch(`/api/proxy/reservas/cliente/${clienteId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!reservasResponse.ok) {
        throw new Error('Error al obtener las reservas');
      }

      const reservasData = await reservasResponse.json();
      console.log('✅ Reservas obtenidas:', reservasData);
      setReservas(reservasData); // 🔄 Actualiza las reservas en tiempo real
    } catch (error: any) {
      console.error('❌ Error al obtener reservas:', error.message);
      setError(error.message);
    }
  };

  const fetchServicios = async (token: string) => {
    try {
      const response = await fetch('/api/proxy/servicios', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los servicios');
      }

      const data = await response.json();
      console.log('✅ Servicios obtenidos:', data);
      setServicios(data);
    } catch (error: any) {
      console.error('❌ Error al obtener servicios:', error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const tokenRes = await fetch('/api/auth/token', { credentials: 'include' });

        if (!tokenRes.ok) {
          throw new Error('No estás autenticado');
        }

        const { access_token } = await tokenRes.json();
        setToken(access_token);

        const tokenPayload = JSON.parse(
          Buffer.from(access_token.split('.')[1], 'base64').toString()
        );

        const userEmail = tokenPayload.sub;
        console.log('🔹 Email del usuario:', userEmail);

        const userResponse = await fetch(`/api/proxy/usuarios?email=${userEmail}`);

        if (!userResponse.ok) {
          throw new Error('Error al obtener el usuario');
        }

        const userData = await userResponse.json();
        console.log('✅ Usuario obtenido:', userData);

        if (userData.tipoUsuario !== 'CLIENTE') {
          throw new Error('Acceso denegado: No eres un cliente');
        }

        setClienteId(userData.id);
        console.log('🔹 ID del Cliente:', userData.id);

        // 🔄 Obtener reservas y servicios
        await fetchReservas(userData.id, access_token);
        await fetchServicios(access_token);
      } catch (error: any) {
        console.error('❌ Error:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // 🔥 Función para abrir el modal de reserva y obtener las fechas reservadas
  const handleOpenReservarModal = async (servicio: any) => {
    try {
      setServicioSeleccionado(servicio);
      setFechaReserva('');

      // 🔥 Obtener la información del servicio para verificar reservas
      const response = await fetch(`/api/proxy/servicios/${servicio.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener la información del servicio');
      }

      const servicioData = await response.json();
      console.log('✅ Servicio con reservas:', servicioData);

      // 🔥 Extraer todas las fechas reservadas de este servicio
      const fechasReservadasArray = servicioData.reservas.map(
        (reserva: any) => reserva.fechaReserva
      );
      setFechasReservadas(fechasReservadasArray);
      setShowReservarModal(true);
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setError(error.message);
    }
  };

  // 🔥 Función para reservar un servicio
  const handleReservar = async () => {
    if (!clienteId || !token || !fechaReserva || !servicioSeleccionado) {
      setError('Error: Datos incompletos.');
      return;
    }

    if (fechasReservadas.includes(fechaReserva)) {
      alert('❌ La fecha seleccionada ya está reservada. Intenta otra fecha.');
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

      if (!response.ok) {
        throw new Error('Error al reservar el servicio');
      }

      alert('✅ Reserva realizada con éxito');
      setShowReservarModal(false);

      // 🔄 Llamar a `fetchReservas` para actualizar la lista en tiempo real
      await fetchReservas(clienteId, token);
      await fetchServicios(token);
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // 🔄 Forzar la eliminación de la cookie en el navegador
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

      // 🔄 Redirigir al usuario a la página de inicio
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-black text-white'>
      <button
        onClick={handleLogout}
        className='absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'
      >
        Cerrar Sesión
      </button>
      <div className='w-3/4 p-6 bg-gray-900 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-bold mb-4 text-center'>Reservas Realizadas</h2>

        {loading && <p className='text-gray-400 text-center'>Cargando...</p>}
        {error && <p className='text-red-500 text-center'>{error}</p>}

        {!loading && reservas.length === 0 ? (
          <p className='text-gray-400 text-center'>No tienes reservas realizadas.</p>
        ) : (
          <ul className='space-y-4'>
            {reservas.map((reserva) => (
              <li
                key={reserva.id}
                className='p-4 bg-gray-800 rounded-lg shadow'
              >
                <p>
                  <strong>ID de la Reserva:</strong> {reserva.id}
                </p>
                <p>
                  <strong>Cliente ID:</strong> {reserva.clienteId}
                </p>
                <p>
                  <strong>Fecha de reserva:</strong> {reserva.fechaReserva}
                </p>
                <p>
                  <strong>Estado:</strong>{' '}
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
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='w-3/4 p-6 bg-gray-900 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-bold mb-4 text-center'>Servicios Disponibles</h2>

        {loading && <p className='text-gray-400 text-center'>Cargando...</p>}
        {error && <p className='text-red-500 text-center'>{error}</p>}

        {!loading && servicios.length === 0 ? (
          <p className='text-gray-400 text-center'>No hay servicios disponibles.</p>
        ) : (
          <ul className='space-y-4'>
            {servicios.map((servicio) => (
              <li
                key={servicio.id}
                className='p-4 bg-gray-800 rounded-lg shadow'
              >
                <h3 className='text-xl font-semibold'>{servicio.nombre}</h3>
                <p className='text-gray-300'>{servicio.descripcion}</p>
                <p className='text-green-400 font-bold mt-2'>${servicio.precio}</p>
                <button
                  onClick={() => handleOpenReservarModal(servicio)}
                  className='mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition'
                >
                  Reservar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔥 Modal para Reservar */}
      {showReservarModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-gray-900 p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-2xl font-bold mb-4'>Reservar {servicioSeleccionado?.nombre}</h2>

            <input
              type='date'
              value={fechaReserva}
              onChange={(e) => setFechaReserva(e.target.value)}
              className='w-full p-2 border rounded bg-gray-800 text-white mb-2'
              required
            />

            {fechasReservadas.includes(fechaReserva) && (
              <p className='text-red-500'>❌ Esta fecha ya está reservada</p>
            )}

            <div className='flex justify-between'>
              <button
                onClick={handleReservar}
                className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition'
                disabled={fechasReservadas.includes(fechaReserva)}
              >
                Confirmar Reserva
              </button>
              <button
                onClick={() => setShowReservarModal(false)}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
