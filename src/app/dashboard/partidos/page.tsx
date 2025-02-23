// src/app/dashboard/partidos/page.tsx
'use client'

import React from 'react';
import {
  Card,
  CardBody,
  Button,
  Tabs,
  Tab,
  Chip,
  useDisclosure,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { Icon } from "@iconify/react";
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function PartidosPage() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [selectedTorneo, setSelectedTorneo] = React.useState<string>("1");

  // Aquí irían los datos reales de tu API
  const torneos = [
    { id: "1", nombre: "Mundial 2026" },
    { id: "2", nombre: "Copa América 2024" },
  ];

  const partidos = [
    {
      codPartido: 1,
      fecha: new Date("2024-06-01T15:00:00"),
      equipo1: "Brasil",
      equipo2: "Argentina",
      scoreEq1: null,
      scoreEq2: null,
      jornada: 1,
      finalizado: false,
      imagen1: "https://via.placeholder.com/50",
      imagen2: "https://via.placeholder.com/50"
    },
    // ... más partidos
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Partidos</h1>
          <Button
            color="primary"
            endContent={<Icon icon="solar:add-circle-bold-duotone" />}
            onPress={onOpen}
          >
            Nuevo Partido
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <Select
            label="Seleccionar Torneo"
            className="max-w-xs"
            selectedKeys={[selectedTorneo]}
            onChange={(e) => setSelectedTorneo(e.target.value)}
          >
            {torneos.map((torneo) => (
              <SelectItem key={torneo.id} value={torneo.id}>
                {torneo.nombre}
              </SelectItem>
            ))}
          </Select>

          <Tabs aria-label="Opciones">
            <Tab 
              key="proximos" 
              title={
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:calendar-bold-duotone" />
                  <span>Próximos</span>
                </div>
              }
            >
              <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                {partidos.map((partido) => (
                  <Card key={partido.codPartido} className="w-full">
                    <CardBody>
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <span className="text-small text-default-500">
                            {partido.fecha.toLocaleDateString()} - {partido.fecha.toLocaleTimeString()}
                          </span>
                          <Chip
                            size="sm"
                            color={partido.finalizado ? "success" : "warning"}
                          >
                            {partido.finalizado ? "Finalizado" : "Pendiente"}
                          </Chip>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <img
                              src={partido.imagen1}
                              alt={partido.equipo1}
                              className="w-8 h-8 rounded-full"
                            />
                            <span>{partido.equipo1}</span>
                          </div>
                          <span className="text-xl font-bold">
                            {partido.scoreEq1 ?? "-"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <img
                              src={partido.imagen2}
                              alt={partido.equipo2}
                              className="w-8 h-8 rounded-full"
                            />
                            <span>{partido.equipo2}</span>
                          </div>
                          <span className="text-xl font-bold">
                            {partido.scoreEq2 ?? "-"}
                          </span>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={() => console.log("score", partido.codPartido)}
                          >
                            Actualizar Score
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => console.log("edit", partido.codPartido)}
                          >
                            <Icon icon="solar:pen-2-bold-duotone" />
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </Tab>
            <Tab 
              key="finalizados" 
              title={
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:check-circle-bold-duotone" />
                  <span>Finalizados</span>
                </div>
              }
            >
              {/* Similar al contenido anterior pero con partidos finalizados */}
            </Tab>
            <Tab 
              key="todos" 
              title={
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:sort-by-time-bold-duotone" />
                  <span>Todos</span>
                </div>
              }
            >
              {/* Todos los partidos */}
            </Tab>
          </Tabs>
        </div>

        {/* Aquí iría el modal para crear/editar partidos */}
      </div>
    </DashboardLayout>
  );
}