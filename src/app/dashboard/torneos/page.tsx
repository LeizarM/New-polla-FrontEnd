// src/app/dashboard/torneos/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
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
  Spinner,
} from '@nextui-org/react';
import { Icon } from "@iconify/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import { Torneo, TorneoResponse } from '@/types/models/Torneo';
import { torneoService } from '@/services/torneo.services';
import { useToast } from '@/hooks/useToast';
import TorneoForm from '@/components/torneos/TorneoForm';

const ROWS_PER_PAGE = 5;

export default function TorneosPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTorneo, setSelectedTorneo] = useState<Torneo | undefined>();
  const [torneoToDelete, setTorneoToDelete] = useState<Torneo | null>(null);
  const { showToast } = useToast();

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const fetchTorneos = async () => {
    try {
      setLoading(true);
      const response: TorneoResponse = await torneoService.getAllTorneos();
      setTorneos(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Error",
        description: error.message || "Error al cargar torneos"
      });
      setTorneos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTorneos();
  }, []);

  const filteredItems = React.useMemo(() => {
    console.log('Torneos antes de filtrar:', torneos);
    const filtered = torneos.filter((torneo) =>
      torneo.nombre?.toLowerCase().includes(filterValue.toLowerCase())
    );
    console.log('Torneos después de filtrar:', filtered);
    return filtered;
  }, [torneos, filterValue]);

  const pages = Math.ceil(filteredItems.length / ROWS_PER_PAGE);
  const items = React.useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    const paginated = filteredItems.slice(start, end);
    console.log('Items paginados:', paginated);
    return paginated;
  }, [page, filteredItems]);

  // Función para convertir cadena YYYY-MM-DD a Date
  const parseDate = (dateStr: string | undefined | Date): Date => {
    if (!dateStr) return new Date();
    if (dateStr instanceof Date) return dateStr;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month - 1 porque los meses en Date son 0-11
  };

  // Corrección de fechas para evitar el desplazamiento de un día
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-';
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    const dateObj = date instanceof Date ? date : new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Formato de montos sin moneda (solo números con separadores de miles)
  const formatAmount = (amount: number | undefined) => {
    if (amount === undefined) return '-';
    return amount.toLocaleString('es-ES');
  };

  const handleSubmit = async (torneo: Torneo) => {
    try {
      // Descomentar cuando el servicio esté implementado
      // await torneoService.register(torneo);
      showToast({
        type: "success",
        title: "Éxito",
        description: selectedTorneo ? "Torneo actualizado correctamente" : "Torneo creado correctamente"
      });
      onFormClose();
      setSelectedTorneo(undefined);
      await fetchTorneos();
      return true;
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Error",
        description: error.message || "Error al procesar la solicitud"
      });
      return false;
    }
  };

  const handleDelete = async () => {
    if (!torneoToDelete) return;
    try {
      // Descomentar cuando el servicio esté implementado
      // await torneoService.delete(torneoToDelete.codTorneo);
      showToast({
        type: "success",
        title: "Éxito",
        description: "Torneo eliminado correctamente"
      });
      onDeleteClose();
      setTorneoToDelete(null);
      await fetchTorneos();
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Error",
        description: error.message || "Error al eliminar el torneo"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center bg-gray-900">
        <Spinner size="lg" label="Cargando torneos..." color="white" />
      </div>
    );
  }

  console.log('Estado de isFormOpen:', isFormOpen);
  console.log('Torneo seleccionado:', selectedTorneo);

  return (
    <div className="p-6 max-w-[1200px] mx-auto bg-gray-900 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-blue-400">Gestión de Torneos</h1>
          <Chip size="sm" variant="flat" color="primary">{torneos.length}</Chip>
        </div>
        <Button
          color="primary"
          size="md"
          endContent={<Icon icon="solar:add-circle-bold" width={20} />}
          onPress={() => {
            setSelectedTorneo(undefined);
            onFormOpen();
          }}
        >
          Nuevo Torneo
        </Button>
      </div>

      <Card className="shadow-lg bg-gray-800 border border-gray-700">
        <CardBody className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Input
              className="w-full max-w-[300px]"
              placeholder="Buscar torneos..."
              startContent={<SearchIcon className="text-gray-400" width={16} />}
              value={filterValue}
              onValueChange={setFilterValue}
              size="sm"
              variant="bordered"
              classNames={{
                input: "text-gray-200 bg-gray-800",
                inputWrapper: "border-gray-600 bg-gray-800",
              }}
            />
          </div>

          <Table
            aria-label="Tabla de torneos"
            isHeaderSticky
            bottomContent={
              pages > 1 ? (
                <div className="flex justify-center py-2">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                    classNames={{
                      cursor: "bg-blue-500 text-white",
                      item: "text-gray-200 hover:bg-gray-700",
                    }}
                  />
                </div>
              ) : null
            }
            classNames={{
              wrapper: "min-h-[300px] p-2",
              th: "bg-blue-800 text-white font-medium",
              td: "py-3 text-gray-200",
              tr: "hover:bg-gray-700",
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
            <TableBody emptyContent="No hay torneos disponibles">
              {items.map((torneo) => (
                <TableRow key={torneo.codTorneo}>
                  <TableCell className="font-medium text-gray-100">{torneo.nombre}</TableCell>
                  <TableCell>{formatDate(torneo.fechaInicio)}</TableCell>
                  <TableCell>{formatDate(torneo.fechaFin)}</TableCell>
                  <TableCell>{formatAmount(torneo.montoTotal)}</TableCell>
                  <TableCell>{formatAmount(torneo.montoFecha)}</TableCell>
                  <TableCell>{formatAmount(torneo.montoPolla)}</TableCell>
                  <TableCell>
                    <Chip
                      color={torneo.finalizado === "SI" ? "success" : "warning"}
                      size="sm"
                      variant="flat"
                      classNames={{
                        base: "bg-opacity-80",
                        content: "text-white",
                      }}
                    >
                      {torneo.finalizado === "SI" ? "Finalizado" : "En curso"}
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
                            // Convertimos las fechas a Date antes de pasarlas
                            const updatedTorneo = {
                              ...torneo,
                              fechaInicio: parseDate(torneo.fechaInicio),
                              fechaFin: parseDate(torneo.fechaFin!),
                            };
                            setSelectedTorneo(updatedTorneo);
                            onFormOpen();
                          }}
                        >
                          <Icon icon="solar:pen-2-linear" width={18} className="text-white" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Eliminar torneo" color="danger">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="danger"
                          onPress={() => {
                            setTorneoToDelete(torneo);
                            onDeleteOpen();
                          }}
                        >
                          <Icon icon="solar:trash-bin-trash-linear" width={18} className="text-white" />
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
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSubmit={handleSubmit}
        torneo={selectedTorneo}
      />

      {/* <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
        torneo={torneoToDelete}
      /> */}
    </div>
  );
}