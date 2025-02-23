// src/components/auth/LoginForm.tsx
'use client'

import {
  Button, Input, Form, Card, CardBody, CardHeader
} from '@nextui-org/react';
import React, { useEffect } from 'react';
import {Icon} from "@iconify/react";
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const { login, loading, error, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const formData = new FormData(event.currentTarget);
      const credentials = {
        usuario: formData.get('usuario') as string,
        contrasena: formData.get('contrasena') as string
      };

      console.log('Enviando credenciales:', credentials);
      
      const response = await login(credentials);
      
      if (response && response.token) {
        console.log('Login exitoso, redirigiendo...');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error en submit:', error);
    }
  };
  
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex justify-between items-center pb-0 px-8 pt-6">
        <p className="text-left text-3xl font-semibold">
          Iniciar Sesión
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>
      </CardHeader>
      <CardBody className="px-8 py-4">
        <Form className="flex flex-col gap-4" validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Usuario"
            labelPlacement="outside"
            name="usuario"
            placeholder="Ingresa tu usuario"
            variant="bordered"
            autoComplete="username"
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Contraseña"
            labelPlacement="outside"
            name="contrasena"
            placeholder="Ingresa tu contraseña"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            autoComplete="current-password"
          />
          
          {error && (
            <div className="text-danger text-sm px-1">{error}</div>
          )}
          
          <Button 
            className="w-full" 
            color="primary" 
            type="submit" 
            isLoading={loading}
          >
            Iniciar Sesión
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};