import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/proxy/clientes',
        destination: 'http://localhost:8003/api/clientes',
      },
      {
        source: '/api/proxy/proveedores',
        destination: 'http://localhost:8003/api/proveedores',
      },
      {
        source: '/api/proxy/usuarios',
        destination: 'http://localhost:8003/api/usuarios/buscar', // 🔥 Proxy para buscar usuario por email
      },
      {
        source: '/api/proxy/servicios/proveedor/:id',
        destination: 'http://localhost:8002/api/servicios/proveedor/:id',
      },
      {
        source: '/api/proxy/servicios/:proveedorId',
        destination: 'http://localhost:8002/api/servicios/:proveedorId',
      },
      {
        source: '/api/proxy/servicios/:id',
        destination: 'http://localhost:8002/api/servicios/:id',
      },
      {
        source: '/api/proxy/reservas/:id/estado/:estado',
        destination: 'http://localhost:8002/api/reservas/:id/estado/:estado',
      },
      {
        source: '/api/proxy/servicios/modificar/:id',
        destination: 'http://localhost:8002/api/servicios/:id',
      },

      // Rutas para Clientes
      {
        source: '/api/proxy/servicios',
        destination: 'http://localhost:8002/api/servicios', // 🔥 Redirige a Spring Boot
      },
      {
        source: '/api/proxy/reservas/:clienteId/:servicioId',
        destination: 'http://localhost:8002/api/reservas/:clienteId/:servicioId',
      },
      {
        source: '/api/proxy/reservas/cliente/:clienteId',
        destination: 'http://localhost:8002/api/reservas/cliente/:clienteId',
      },
    ];
  },
};

export default nextConfig;
