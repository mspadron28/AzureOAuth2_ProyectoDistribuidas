'use client';
import { useEffect, useState } from 'react';

export default function ProveedorHome() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
  });

  const [proveedorId, setProveedorId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Estado para modal de reservas
  const [showReservasModal, setShowReservasModal] = useState(false);
  const [reservas, setReservas] = useState<any[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<any | null>(null);

  // Modificar
  const [showEditModal, setShowEditModal] = useState(false);
  const [servicioEditado, setServicioEditado] = useState<any>({
    id: null,
    nombre: '',
    descripcion: '',
    precio: '',
  });

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        // 🔥 Obtener el token desde las cookies
        const tokenRes = await fetch('/api/auth/token', { credentials: 'include' });

        if (!tokenRes.ok) {
          throw new Error('No estás autenticado');
        }

        const { access_token } = await tokenRes.json();
        setToken(access_token); // Guardamos el token

        const tokenPayload = JSON.parse(
          Buffer.from(access_token.split('.')[1], 'base64').toString()
        );

        const userEmail = tokenPayload.sub; // 📌 Email viene en `sub`
        console.log('🔹 Email del usuario:', userEmail);

        // 🔥 Obtener el ID del usuario desde la API de usuarios
        const userResponse = await fetch(`/api/proxy/usuarios?email=${userEmail}`);

        if (!userResponse.ok) {
          throw new Error('Error al obtener el usuario');
        }

        const userData = await userResponse.json();
        console.log('✅ Usuario obtenido:', userData);

        if (userData.tipoUsuario !== 'PROVEEDOR') {
          throw new Error('Acceso denegado: No eres un proveedor');
        }

        const proveedorId = userData.id; // 📌 El ID del usuario está aquí
        setProveedorId(proveedorId);
        console.log('🔹 ID del Proveedor:', proveedorId);

        // 🔥 Obtener los servicios del proveedor con el token
        const response = await fetch(`/api/proxy/servicios/proveedor/${proveedorId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`, // 🔥 Se envía el token
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
        console.error('❌ Error:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  // 🔥 Función para ver reservas de un servicio
  const handleVerReservas = async (servicioId: number) => {
    if (!token) {
      setError('Error: No se pudo obtener el token.');
      return;
    }

    try {
      const response = await fetch(`/api/proxy/servicios/${servicioId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las reservas');
      }

      const data = await response.json();
      console.log('✅ Servicio obtenido con reservas:', data);

      setServicioSeleccionado(data);
      setReservas(data.reservas || []);
      setShowReservasModal(true);
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setError(error.message);
    }
  };

  // 🔥 Función para cambiar el estado de una reserva
  const handleCambiarEstado = async (reservaId: number, nuevoEstado: string) => {
    if (!token) {
      setError('Error: No se pudo obtener el token.');
      return;
    }

    try {
      const response = await fetch(`/api/proxy/reservas/${reservaId}/estado/${nuevoEstado}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la reserva');
      }

      // 🔄 Actualizar estado localmente
      setReservas((prevReservas) =>
        prevReservas.map((reserva) =>
          reserva.id === reservaId ? { ...reserva, estado: nuevoEstado } : reserva
        )
      );

      console.log(`✅ Estado de la reserva ${reservaId} cambiado a ${nuevoEstado}`);
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setError(error.message);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoServicio({ ...nuevoServicio, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!proveedorId || !token) {
      setError('Error: No se pudo obtener el ID del proveedor o el token.');
      return;
    }

    try {
      const response = await fetch(`/api/proxy/servicios/${proveedorId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nuevoServicio.nombre,
          descripcion: nuevoServicio.descripcion,
          precio: parseFloat(nuevoServicio.precio),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el servicio');
      }

      const nuevoServicioData = await response.json();
      setServicios([...servicios, nuevoServicioData]); // Agregar nuevo servicio a la lista
      handleCloseModal();
      setNuevoServicio({ nombre: '', descripcion: '', precio: '' }); // Resetear formulario
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setError(error.message);
    }
  };

  // 🔥 Función para abrir el modal de edición
  const handleOpenEditModal = (servicio: any) => {
    setServicioEditado({
      id: servicio.id,
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio.toString(),
    });
    setShowEditModal(true);
  };

  // 🔥 Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setServicioEditado({ id: null, nombre: '', descripcion: '', precio: '' });
  };

  // 🔥 Función para actualizar los datos del formulario
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setServicioEditado({ ...servicioEditado, [e.target.name]: e.target.value });
  };

  // 🔥 Función para modificar un servicio
  const handleEditSubmit = async () => {
    if (!proveedorId || !token || !servicioEditado.id) {
      setError('Error: No se pudo obtener los datos necesarios.');
      return;
    }

    try {
      const response = await fetch(`/api/proxy/servicios/${servicioEditado.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: servicioEditado.nombre,
          descripcion: servicioEditado.descripcion,
          precio: parseFloat(servicioEditado.precio),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al modificar el servicio');
      }

      const servicioActualizado = await response.json();

      setServicios((prevServicios) =>
        prevServicios.map((servicio) =>
          servicio.id === servicioEditado.id ? { ...servicio, ...servicioActualizado } : servicio
        )
      );

      handleCloseEditModal();
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
      <div className='w-3/4 p-6 bg-gray-900 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-bold mb-4 text-center'>Servicios Publicados</h2>
        <button
          onClick={handleLogout}
          className='absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'
        >
          Cerrar Sesión
        </button>

        {loading && <p className='text-gray-400 text-center'>Cargando...</p>}
        {error && <p className='text-red-500 text-center'>{error}</p>}

        <button
          onClick={handleOpenModal}
          className='mb-4 px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition'
        >
          + Agregar Servicio
        </button>

        {!loading && servicios.length === 0 ? (
          <p className='text-gray-400 text-center'>No tienes servicios publicados.</p>
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
                  onClick={() => handleVerReservas(servicio.id)}
                  className='mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition'
                >
                  Ver Reservas
                </button>
                <button
                  onClick={() => handleOpenEditModal(servicio)}
                  className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
                >
                  Modificar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔥 Modal para Agregar Servicio */}
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-gray-900 p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-2xl font-bold mb-4'>Agregar Servicio</h2>

            <input
              type='text'
              name='nombre'
              placeholder='Nombre del servicio'
              value={nuevoServicio.nombre}
              onChange={handleChange}
              className='w-full p-2 border rounded bg-gray-800 text-white mb-2'
              required
            />
            <textarea
              name='descripcion'
              placeholder='Descripción'
              value={nuevoServicio.descripcion}
              onChange={handleChange}
              className='w-full p-2 border rounded bg-gray-800 text-white mb-2'
              required
            />
            <input
              type='number'
              name='precio'
              placeholder='Precio'
              value={nuevoServicio.precio}
              onChange={handleChange}
              className='w-full p-2 border rounded bg-gray-800 text-white mb-4'
              required
            />

            <div className='flex justify-between'>
              <button
                onClick={handleSubmit}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
              >
                Guardar
              </button>
              <button
                onClick={handleCloseModal}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 Modal para Ver Reservas */}
      {showReservasModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-gray-900 p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-2xl font-bold mb-4'>Reservas de {servicioSeleccionado?.nombre}</h2>

            {reservas.length === 0 ? (
              <p className='text-gray-400 text-center'>No hay reservas para este servicio.</p>
            ) : (
              <ul className='space-y-2'>
                {reservas.map((reserva) => (
                  <li
                    key={reserva.id}
                    className='p-2 bg-gray-800 rounded'
                  >
                    <p>
                      <strong>ID Cliente:</strong> {reserva.clienteId}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {reserva.fechaReserva}
                    </p>
                    <p>
                      <strong>Estado:</strong> {reserva.estado}
                    </p>
                    <div className='flex justify-between mt-2'>
                      <button
                        onClick={() => handleCambiarEstado(reserva.id, 'CONFIRMADA')}
                        className='px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => handleCambiarEstado(reserva.id, 'CANCELADA')}
                        className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
                      >
                        Cancelar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowReservasModal(false)}
              className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition w-full'
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* 🔥 Modal para Modificar Servicio */}
      {showEditModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-gray-900 p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-2xl font-bold mb-4'>Modificar Servicio</h2>

            <input
              type='text'
              name='nombre'
              placeholder='Nombre del servicio'
              value={servicioEditado.nombre}
              onChange={handleEditChange}
              className='w-full p-2 border rounded bg-gray-800 text-white mb-2'
              required
            />
            <textarea
              name='descripcion'
              placeholder='Descripción'
              value={servicioEditado.descripcion}
              onChange={handleEditChange}
              className='w-full p-2 border rounded bg-gray-800 text-white mb-2'
              required
            />
            <input
              type='number'
              name='precio'
              placeholder='Precio'
              value={servicioEditado.precio}
              onChange={handleEditChange}
              className='w-full p-2 border rounded bg-gray-800 text-white mb-4'
              required
            />

            <div className='flex justify-between'>
              <button
                onClick={handleEditSubmit}
                className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition'
              >
                Guardar cambios
              </button>
              <button
                onClick={handleCloseEditModal}
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
