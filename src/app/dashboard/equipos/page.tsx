'use client';

import React from 'react';
import { useEquipos } from '@/hooks/useEquipos';
import { useDisclosure } from '@nextui-org/react';
import { Card, Chip, Input, Button, Spinner } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { SearchIcon } from '@nextui-org/shared-icons';
import EquiposTable from '@/components/equipos/EquiposTable';
import EquipoForm from '@/components/equipos/EquipoForm';
import DeleteConfirmationModal from '@/components/equipos/DeleteConfirmationModal';
import { Equipo } from '@/types/models/Equipo';

const ROWS_PER_PAGE = 10;

export default function EquiposPage() {
  const {
    equipos,
    loading,
    handleSubmit,
    handleDelete
  } = useEquipos();

  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "nombre",
    direction: "ascending" as "ascending" | "descending",
  });
  const [selectedEquipo, setSelectedEquipo] = React.useState<Equipo | undefined>();
  const [equipoToDelete, setEquipoToDelete] = React.useState<Equipo | null>(null);

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Optimización del filtrado
  const filteredItems = React.useMemo(() => {
    const searchLower = filterValue.toLowerCase();
    return equipos.filter((equipo) => {
      const nombreMatch = equipo.nombre?.toLowerCase().includes(searchLower) || false;
      const descripcionMatch = equipo.descripcion?.toLowerCase().includes(searchLower) || false;
      return nombreMatch || descripcionMatch;
    });
  }, [equipos, filterValue]);

  // Optimización de la paginación y ordenamiento
  const sortedAndPaginatedItems = React.useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return [...filteredItems]
      .sort((a, b) => {
        const first = (a[sortDescriptor.column as keyof Equipo] || '').toString();
        const second = (b[sortDescriptor.column as keyof Equipo] || '').toString();
        return sortDescriptor.direction === "ascending" 
          ? first.localeCompare(second)
          : second.localeCompare(first);
      })
      .slice(start, end);
  }, [filteredItems, page, sortDescriptor]);

  const pages = Math.ceil(filteredItems.length / ROWS_PER_PAGE);

  const handleSearchChange = React.useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const handleFormSubmit = async (equipo: Equipo) => {
    const success = await handleSubmit(equipo, selectedEquipo);
    if (success) {
      onFormClose();
      setSelectedEquipo(undefined);
    }
  };

  const handleDeleteConfirm = async () => {
    if (equipoToDelete?.codEquipo) {
      const success = await handleDelete(equipoToDelete.codEquipo);
      if (success) {
        onDeleteClose();
        setEquipoToDelete(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" label="Cargando equipos..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">Equipos</h1>
          <Chip size="sm" variant="flat" color="primary">{equipos.length}</Chip>
        </div>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" width={20} />}
          onPress={() => {
            setSelectedEquipo(undefined);
            onFormOpen();
          }}
        >
          Nuevo Equipo
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 py-4">
          <Input
            className="max-w-[300px]"
            placeholder="Buscar equipos..."
            startContent={<SearchIcon className="text-default-400" width={16} />}
            value={filterValue}
            onValueChange={handleSearchChange}
            size="sm"
          />
        </div>

        <EquiposTable
          items={sortedAndPaginatedItems}
          page={page}
          total={pages}
          sortDescriptor={sortDescriptor}
          onPageChange={setPage}
          onSortChange={(descriptor) => setSortDescriptor({
            column: descriptor.column.toString(),
            direction: descriptor.direction
          })}
          onEdit={(equipo) => {
            setSelectedEquipo(equipo);
            onFormOpen();
          }}
          onDelete={(equipo) => {
            setEquipoToDelete(equipo);
            onDeleteOpen();
          }}
        />
      </Card>

      <EquipoForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSubmit={handleFormSubmit}
        equipo={selectedEquipo}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDeleteConfirm}
        equipo={equipoToDelete}
      />
    </div>
  );
}