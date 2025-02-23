// src/app/dashboard/torneos/page.tsx
'use client'

import React from 'react';
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  useDisclosure
} from '@nextui-org/react';
import { Icon } from "@iconify/react";
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function TorneosPage() {
  const {isOpen, onOpen, onClose} = useDisclosure();

  // Aquí irían los datos reales de tu API
  const torneos = [
    {
      codTorneo: 1,
      nombre: "Mundial 2026",
      fechaInicio: new Date("2026-06-01"),
      fechaFin: new Date("2026-07-15"),
      montoTotal: 1000,
      finalizado: false
    },
    // ... más torneos
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Torneos</h1>
          <Button
            color="primary"
            endContent={<Icon icon="solar:add-circle-bold-duotone" />}
            onPress={onOpen}
          >
            Nuevo Torneo
          </Button>
        </div>

        <Card>
          <CardBody>
            <Table aria-label="Tabla de torneos">
              <TableHeader>
                <TableColumn>NOMBRE</TableColumn>
                <TableColumn>FECHA INICIO</TableColumn>
                <TableColumn>FECHA FIN</TableColumn>
                <TableColumn>MONTO</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody>
                {torneos.map((torneo) => (
                  <TableRow key={torneo.codTorneo}>
                    <TableCell>{torneo.nombre}</TableCell>
                    <TableCell>{torneo.fechaInicio.toDateString()}</TableCell>
                    <TableCell>{torneo.fechaFin.toDateString()}</TableCell>
                    <TableCell>${torneo.montoTotal}</TableCell>
                    <TableCell>
                      <Chip
                        color={torneo.finalizado ? "success" : "warning"}
                        size="sm"
                        variant="flat"
                      >
                        {torneo.finalizado ? "Finalizado" : "En Curso"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => console.log("edit", torneo.codTorneo)}
                        >
                          <Icon icon="solar:pen-2-bold-duotone" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => console.log("delete", torneo.codTorneo)}
                        >
                          <Icon icon="solar:trash-bin-trash-bold-duotone" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Aquí iría el modal para crear/editar torneos */}
      </div>
    </DashboardLayout>
  );
}