// src/app/dashboard/page.tsx
'use client'

import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Icon } from "@iconify/react";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const stats = [
    {
      title: "Usuario",
      value: user?.username,
      icon: "solar:user-id-bold-duotone",
      color: "text-primary"
    },
    {
      title: "Rol",
      value: user?.esAdmin ? "Administrador" : "Usuario",
      icon: "solar:shield-user-bold-duotone",
      color: "text-success"
    },
    {
      title: "Estado",
      value: "Activo",
      icon: "solar:check-circle-bold-duotone",
      color: "text-warning"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-3">
            <Icon 
              className="text-default-500" 
              icon="solar:bell-bold-duotone" 
              width={24} 
            />
            <Icon 
              className="text-default-500" 
              icon="solar:settings-bold-duotone" 
              width={24} 
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none">
              <CardHeader className="flex gap-3 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-default-100">
                  <Icon 
                    className={stat.color}
                    icon={stat.icon}
                    width={24}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-small text-default-500">{stat.title}</p>
                  <p className="text-medium font-medium">{stat.value}</p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="border-none">
          <CardHeader>
            <h2 className="text-xl font-semibold">Actividad Reciente</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center gap-4 border-b border-divider pb-4 last:border-none">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-default-100">
                    <Icon 
                      className="text-default-500"
                      icon="solar:clock-circle-bold-duotone"
                      width={20}
                    />
                  </div>
                  <div>
                    <p className="text-small font-medium">Inicio de sesión exitoso</p>
                    <p className="text-tiny text-default-500">Hace {index + 1} horas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}