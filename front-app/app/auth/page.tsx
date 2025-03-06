"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [userType, setUserType] = useState('cliente');
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

  const router = useRouter();

  const validateForm = () => {
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      toast.error('Nombre y apellido son obligatorios y deben ser texto.');
      return false;
    }
    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(formData.email)) {
      toast.error('Ingrese un correo válido.');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    if (!/^\d{10}$/.test(formData.telefono)) {
      toast.error('El teléfono debe tener exactamente 10 dígitos.');
      return false;
    }
    const today = new Date().toISOString().split('T')[0];
    if (formData.fechaNacimiento > today) {
      toast.error('La fecha de nacimiento no puede ser futura.');
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const endpoint = userType === 'cliente' ? '/api/proxy/clientes' : '/api/proxy/proveedores';
    const body = userType === 'cliente' ? { ...formData, empresa: undefined } : { ...formData, direccion: undefined };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Registro fallido');

      toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('Error en el registro');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-200">
      <Card className="w-[500px] shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-teal-600">Registro en ReservaFácil</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cliente" onValueChange={(value) => setUserType(value)}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="cliente">Cliente</TabsTrigger>
              <TabsTrigger value="proveedor">Proveedor</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-3">
              <TabsContent value={userType}>
                <Input name="nombre" placeholder="Nombre" onChange={handleChange} required />
                <Input name="apellido" placeholder="Apellido" onChange={handleChange} required />
                <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <Input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
                <Input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
                <Input type="date" name="fechaNacimiento" onChange={handleChange} required />

                {userType === 'cliente' && (
                  <Input name="direccion" placeholder="Dirección" onChange={handleChange} required />
                )}

                {userType === 'proveedor' && (
                  <Input name="empresa" placeholder="Empresa" onChange={handleChange} required />
                )}

                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  Registrarse
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => router.push('/')}>Regresar</Button>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
