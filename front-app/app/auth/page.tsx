'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [userType, setUserType] = useState('cliente'); // Cliente o proveedor
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    fechaNacimiento: '',
    empresa: '',
    direccion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = userType === 'cliente' ? '/api/proxy/clientes' : '/api/proxy/proveedores';

    const body =
      userType === 'cliente'
        ? {
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            password: formData.password,
            telefono: formData.telefono,
            fechaNacimiento: formData.fechaNacimiento,
            direccion: formData.direccion, // Solo clientes tienen dirección
          }
        : {
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            password: formData.password,
            telefono: formData.telefono,
            fechaNacimiento: formData.fechaNacimiento,
            empresa: formData.empresa, // Solo proveedores tienen empresa
          };

    try {
      console.log('endpoint', endpoint);
      console.log('body', body);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      window.location.href = '/';
    } catch (error) {
      console.error('Error:', error);
      alert('Error en el registro');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-2xl font-bold mb-4'>Registrarse</h2>

        <form
          className='space-y-4'
          onSubmit={handleSubmit}
        >
          <select
            name='userType'
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className='w-full p-2 border rounded'
            required
          >
            <option value='cliente'>Cliente</option>
            <option value='proveedor'>Proveedor</option>
          </select>

          <input
            type='text'
            name='nombre'
            placeholder='Nombre'
            value={formData.nombre}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          />
          <input
            type='text'
            name='apellido'
            placeholder='Apellido'
            value={formData.apellido}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          />
          <input
            type='password'
            name='password'
            placeholder='Contraseña'
            value={formData.password}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          />
          <input
            type='text'
            name='telefono'
            placeholder='Teléfono'
            value={formData.telefono}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          />
          <input
            type='date'
            name='fechaNacimiento'
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            required
          />

          {userType === 'proveedor' && (
            <input
              type='text'
              name='empresa'
              placeholder='Empresa'
              value={formData.empresa}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            />
          )}

          {userType === 'cliente' && (
            <input
              type='text'
              name='direccion'
              placeholder='Dirección'
              value={formData.direccion}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            />
          )}

          <button
            type='submit'
            className='w-full bg-green-500 text-white p-2 rounded'
          >
            Registrarse
          </button>
          <button
            type='button'
            onClick={() => (window.location.href = '/')}
            className='w-full bg-blue-500 text-white p-2 rounded'
          >
            Regresar
          </button>
        </form>
      </div>
    </div>
  );
}
