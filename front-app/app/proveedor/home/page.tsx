"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProveedorHome() {
  const router = useRouter();
  const [servicios, setServicios] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [proveedorId, setProveedorId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Estado para modal de nuevo servicio
  const [showModal, setShowModal] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
  });

  // Estado para modal de reservas
  const [showReservasModal, setShowReservasModal] = useState(false);
  const [reservas, setReservas] = useState<any[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<any | null>(null);

  // Estado para modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [servicioEditado, setServicioEditado] = useState<any>({
    id: null,
    nombre: '',
    descripcion: '',
    precio: '',
  });

  // Carga inicial de datos
  useEffect(() => {
    const fetchServicios = async () => {
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

        if (userData.tipoUsuario !== 'PROVEEDOR') {
          throw new Error('Acceso denegado: No eres un proveedor');
        }

        const proveedorId = userData.id;
        setProveedorId(proveedorId);

        const response = await fetch(`/api/proxy/servicios/proveedor/${proveedorId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Error al obtener los servicios');
        const data = await response.json();
        setServicios(data);
      } catch (error: any) {
        console.error('❌ Error:', error.message);
        toast.error(error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  // Ver reservas de un servicio
  const handleVerReservas = async (servicioId: number) => {
    if (!token) {
      toast.error('Error: No se pudo obtener el token.');
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
      if (!response.ok) throw new Error('Error al obtener las reservas');
      const data = await response.json();
      setServicioSeleccionado(data);
      setReservas(data.reservas || []);
      setShowReservasModal(true);
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      toast.error(error.message);
      setError(error.message);
    }
  };

  // Cambiar estado de una reserva
  const handleCambiarEstado = async (reservaId: number, nuevoEstado: string) => {
    if (!token) {
      toast.error('Error: No se pudo obtener el token.');
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
      if (!response.ok) throw new Error('Error al actualizar el estado de la reserva');
      setReservas((prevReservas) =>
        prevReservas.map((reserva) =>
          reserva.id === reservaId ? { ...reserva, estado: nuevoEstado } : reserva
        )
      );
      toast.success(`Estado cambiado a ${nuevoEstado}`);
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      toast.error(error.message);
      setError(error.message);
    }
  };

  // Agregar nuevo servicio
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoServicio({ ...nuevoServicio, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!proveedorId || !token) {
      toast.error('Error: No se pudo obtener el ID del proveedor o el token.');
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
      if (!response.ok) throw new Error('Error al agregar el servicio');
      const nuevoServicioData = await response.json();
      setServicios([...servicios, nuevoServicioData]);
      setShowModal(false);
      setNuevoServicio({ nombre: '', descripcion: '', precio: '' });
      toast.success('Servicio agregado con éxito');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      toast.error(error.message);
      setError(error.message);
    }
  };

  // Editar servicio
  const handleOpenEditModal = (servicio: any) => {
    setServicioEditado({
      id: servicio.id,
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio.toString(),
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setServicioEditado({ ...servicioEditado, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    if (!proveedorId || !token || !servicioEditado.id) {
      toast.error('Error: No se pudo obtener los datos necesarios.');
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
      if (!response.ok) throw new Error('Error al modificar el servicio');
      const servicioActualizado = await response.json();
      setServicios((prevServicios) =>
        prevServicios.map((servicio) =>
          servicio.id === servicioEditado.id ? { ...servicio, ...servicioActualizado } : servicio
        )
      );
      setShowEditModal(false);
      toast.success('Servicio modificado con éxito');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      toast.error(error.message);
      setError(error.message);
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
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

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Servicios Publicados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-gray-500">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <Button
            onClick={() => setShowModal(true)}
            className="mb-4 bg-green-500 hover:bg-green-600"
          >
            + Agregar Servicio
          </Button>
          {!loading && servicios.length === 0 ? (
            <p className="text-gray-500">No tienes servicios publicados.</p>
          ) : (
            servicios.map((servicio) => (
              <Card key={servicio.id} className="mb-3 p-4">
                <h3 className="text-xl font-semibold">{servicio.nombre}</h3>
                <p className="text-gray-600">{servicio.descripcion}</p>
                <p className="text-green-600 font-bold mt-2">${servicio.precio}</p>
                <div className="flex space-x-2 mt-2">
                  <Button
                    onClick={() => handleVerReservas(servicio.id)}
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    Ver Reservas
                  </Button>
                  <Button
                    onClick={() => handleOpenEditModal(servicio)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Modificar
                  </Button>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Modal para Agregar Servicio */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="p-6 w-96">
            <CardHeader>
              <CardTitle>Agregar Servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del servicio"
                value={nuevoServicio.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-100 text-black mb-2"
                required
              />
              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={nuevoServicio.descripcion}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-100 text-black mb-2"
                required
              />
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={nuevoServicio.precio}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-100 text-black mb-4"
                required
              />
              <div className="flex justify-between">
                <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
                  Guardar
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal para Ver Reservas */}
      {showReservasModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="p-6 w-96">
            <CardHeader>
              <CardTitle>Reservas de {servicioSeleccionado?.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              {reservas.length === 0 ? (
                <p className="text-gray-500">No hay reservas para este servicio.</p>
              ) : (
                reservas.map((reserva) => (
                  <Card key={reserva.id} className="mb-2 p-2">
                    <p><strong>ID Cliente:</strong> {reserva.clienteId}</p>
                    <p><strong>Fecha:</strong> {reserva.fechaReserva}</p>
                    <p><strong>Estado:</strong> {reserva.estado}</p>
                    <div className="flex justify-between mt-2">
                      <Button
                        onClick={() => handleCambiarEstado(reserva.id, 'CONFIRMADA')}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Confirmar
                      </Button>
                      <Button
                        onClick={() => handleCambiarEstado(reserva.id, 'CANCELADA')}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </Card>
                ))
              )}
              <Button
                onClick={() => setShowReservasModal(false)}
                className="mt-4 w-full bg-red-500 hover:bg-red-600"
              >
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal para Modificar Servicio */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="p-6 w-96">
            <CardHeader>
              <CardTitle>Modificar Servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del servicio"
                value={servicioEditado.nombre}
                onChange={handleEditChange}
                className="w-full p-2 border rounded bg-gray-100 text-black mb-2"
                required
              />
              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={servicioEditado.descripcion}
                onChange={handleEditChange}
                className="w-full p-2 border rounded bg-gray-100 text-black mb-2"
                required
              />
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={servicioEditado.precio}
                onChange={handleEditChange}
                className="w-full p-2 border rounded bg-gray-100 text-black mb-4"
                required
              />
              <div className="flex justify-between">
                <Button onClick={handleEditSubmit} className="bg-green-500 hover:bg-green-600">
                  Guardar cambios
                </Button>
                <Button
                  onClick={() => setShowEditModal(false)}
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