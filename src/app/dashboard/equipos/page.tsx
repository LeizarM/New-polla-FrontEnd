// src/app/dashboard/equipos/page.tsx
'use client'

import React from 'react';
import {
  Card,
  CardBody,
  Button,
  Input,
  
} from '@nextui-org/react';
import { Icon } from "@iconify/react";
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function EquiposPage() {
  

  // Aquí irían los datos reales de tu API
  const equipos = [
    {
      codEquipo: 1,
      nombre: "Brasil",
      descripcion: "Selección de Brasil",
      imagen: "https://via.placeholder.com/150"
    },
    // ... más equipos
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
      </div>
    </DashboardLayout>
  );
}