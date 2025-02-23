// src/app/dashboard/page.tsx
'use client'

import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Icon } from "@iconify/react";

export default function DashboardPage() {
  // Datos de ejemplo
  const stats = [
    {
      title: "Torneos Activos",
      value: "3",
      icon: "solar:cup-star-bold-duotone",
      color: "primary"
    },
    {
      title: "Apuestas Activas",
      value: "28",
      icon: "solar:ticket-star-bold-duotone",
      color: "success"
    },
    {
      title: "Pollas en Curso",
      value: "12",
      icon: "solar:medal-bold-duotone",
      color: "warning"
    },
    {
      title: "Usuarios Registrados",
      value: "156",
      icon: "solar:users-group-rounded-bold-duotone",
      color: "secondary"
    }
  ];

  const recentActivity = [
    {
      type: "bet",
      user: "Juan Pérez",
      action: "realizó una apuesta",
      detail: "Brasil vs Argentina",
      time: "hace 5 minutos"
    },
    // ... más actividades
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-default-500">Bienvenido de vuelta</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none">
            <CardHeader className="flex gap-3 pb-2">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${stat.color}/10`}>
                <Icon
                  className={`text-${stat.color}`}
                  icon={stat.icon}
                  width={24}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-small text-default-500">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Actividad Reciente</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${
                    activity.type === 'bet' ? 'primary' : 'success'
                  }/10`}>
                    <Icon
                      icon={
                        activity.type === 'bet'
                          ? "solar:ticket-star-bold-duotone"
                          : "solar:user-check-bold-duotone"
                      }
                      className={`text-${activity.type === 'bet' ? 'primary' : 'success'}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium">
                      {activity.user} {activity.action}
                    </p>
                    <p className="text-small text-default-500">
                      {activity.detail} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Próximos Eventos</h2>
          </CardHeader>
          <CardBody>
            {/* Contenido de próximos eventos */}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}