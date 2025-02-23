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
  // Custom hook para la lógica de equipos
  const {
    equipos,
    loading,
    handleSubmit,
    handleDelete
  } = useEquipos();

  // Estados locales
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<{ column: string; direction: "ascending" | "descending"; }>({
    column: "nombre",
    direction: "ascending",
  });
  const [selectedEquipo, setSelectedEquipo] = React.useState<Equipo | undefined>();
  const [equipoToDelete, setEquipoToDelete] = React.useState<Equipo | null>(null);

  // Modales
  const { 
    isOpen: isFormOpen, 
    onOpen: onFormOpen, 
    onClose: onFormClose 
  } = useDisclosure();
  
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  // Filtrado de items
  const filteredItems = React.useMemo(() => {
    return equipos.filter((equipo) =>
      equipo.nombre.toLowerCase().includes(filterValue.toLowerCase()) ||
      equipo.descripcion?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [equipos, filterValue]);

  // Paginación
  const pages = Math.ceil(filteredItems.length / ROWS_PER_PAGE);
  const items = React.useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return filteredItems
      .sort((a, b) => {
        const first = a[sortDescriptor.column as keyof Equipo] ?? '';
        const second = b[sortDescriptor.column as keyof Equipo] ?? '';
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      })
      .slice(start, end);
  }, [page, filteredItems, sortDescriptor]);

  // Handlers
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

  // Componentes memorizados
  const TopBar = React.memo(() => (
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
  ));
  TopBar.displayName = "TopBar";
  const SearchBar = React.memo(() => (
    <div className="flex items-center gap-4 py-4">
      <Input
        className="max-w-[300px]"
        placeholder="Buscar equipos..."
        startContent={<SearchIcon className="text-default-400" width={16} />}
        value={filterValue}
        onValueChange={(value) => {
          setFilterValue(value);
          setPage(1);
        }}
      />
    </div>
  ));
  SearchBar.displayName = "SearchBar";
  

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" label="Cargando equipos..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <TopBar />
      <Card className="p-4">
        <SearchBar />
        <EquiposTable
          items={items}
          page={page}
          total={pages}
          sortDescriptor={sortDescriptor}
          onPageChange={setPage}
          onSortChange={(descriptor) => setSortDescriptor({ column: descriptor.column.toString(), direction: descriptor.direction })}
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