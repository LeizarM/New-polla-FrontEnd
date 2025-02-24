// src/app/dashboard/torneos/page.tsx
'use client'

import React, { useMemo, useState } from 'react';
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
  useDisclosure,
  Input,
  Tooltip,
  Pagination,
} from '@nextui-org/react';
import { Icon } from "@iconify/react";
import TorneoForm from '@/components/torneos/TorneoForm';
import { Torneo } from '@/types/models/Torneo';


const ROWS_PER_PAGE = 5;

export default function TorneosPage() {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTorneo, setSelectedTorneo] = useState<Torneo | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Datos de ejemplo (en una implementación real vendrían de una API)
  const torneos: Torneo[] = [
    {
      codTorneo: 1,
      nombre: "COPA AMERICA 2015",
      fechaInicio: new Date("2015-06-11"),
      fechaFin: new Date("2015-07-05"),
      montoTotal: 5,
      montoFecha: 2,
      montoPolla: 3,
      finalizado: true,
    },
    {
      codTorneo: 2,
      nombre: "COPA AMERICA 2016",
      fechaInicio: new Date("2016-06-03"),
      fechaFin: new Date("2016-06-26"),
      montoTotal: 5,
      montoFecha: 2,
      montoPolla: 3,
      finalizado: true,
    },
  ];

  // Filtrado de torneos
  const filteredTorneos = useMemo(() => {
    return torneos.filter(torneo =>
      torneo.nombre?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [torneos, filterValue]);

  // Paginación
  const pages = Math.ceil(filteredTorneos.length / ROWS_PER_PAGE);
  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return filteredTorneos.slice(start, end);
  }, [page, filteredTorneos]);

  // Formateo de fechas
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Manejo del envío del formulario
  const handleSubmit = async (torneo: Torneo): Promise<boolean> => {
    try {
      // Aquí iría tu lógica de API, por ejemplo:
      // await torneoService.save(torneo);
      console.log('Guardar torneo:', torneo);
      // Actualizar la lista de torneos si es necesario
      return true;
    } catch (error) {
      console.error('Error al guardar torneo:', error);
      return false;
    }
  };

  const topContent = useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          className="w-full max-w-[300px]"
          placeholder="Buscar torneos..."
          size="sm"
          startContent={<Icon icon="solar:magnifer-linear" />}
          value={filterValue}
          onValueChange={setFilterValue}
        />
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" width={20} />}
          onPress={() => {
            setSelectedTorneo(undefined); // Para modo creación
            onOpen();
          }}
        >
          Nuevo Torneo
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-default-400">
          Total: {torneos.length} torneos
        </span>
      </div>
    </div>
  ), [filterValue, torneos.length]);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Gestión de Torneos</h1>

      <Card className="shadow-lg">
        <CardBody className="p-0">
          <Table
            aria-label="Tabla de torneos"
            isHeaderSticky
            topContent={topContent}
            bottomContent={
              pages > 1 && (
                <div className="flex justify-center py-2">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                  />
                </div>
              )
            }
            classNames={{
              wrapper: "min-h-[222px] p-4",
              th: "bg-primary-50 text-primary-800",
              td: "py-3",
            }}
          >
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>FECHA INICIO</TableColumn>
              <TableColumn>FECHA FIN</TableColumn>
              <TableColumn>MONTO TOTAL</TableColumn>
              <TableColumn>MONTO FECHA</TableColumn>
              <TableColumn>MONTO POLLA</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn className="text-right">ACCIONES</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No se encontraron torneos">
              {items.map((torneo) => (
                <TableRow key={torneo.codTorneo}>
                  <TableCell className="font-medium">{torneo.nombre}</TableCell>
                  <TableCell>{formatDate(torneo.fechaInicio!)}</TableCell>
                  <TableCell>{formatDate(torneo.fechaFin!)}</TableCell>
                  <TableCell>
                    ${torneo.montoTotal!.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    ${torneo.montoFecha!.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    ${torneo.montoPolla!.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={torneo.finalizado ? "success" : "warning"}
                      size="sm"
                      variant="flat"
                      className="px-2"
                    >
                      {torneo.finalizado ? "Finalizado" : "En Curso"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Tooltip content="Editar torneo" color="primary">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="primary"
                          onPress={() => {
                            setSelectedTorneo(torneo); // Selecciona el torneo para edición
                            onOpen();
                          }}
                        >
                          <Icon icon="solar:pen-2-linear" width={18} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Eliminar torneo" color="danger">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="danger"
                          onPress={() => console.log("delete", torneo.codTorneo)}
                        >
                          <Icon icon="solar:trash-bin-trash-linear" width={18} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <TorneoForm
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedTorneo(undefined);
        }}
        onSubmit={handleSubmit}
        torneo={selectedTorneo}
      />
    </div>
  );
}