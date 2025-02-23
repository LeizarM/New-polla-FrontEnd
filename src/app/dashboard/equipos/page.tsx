"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  SortDescriptor,
  Chip,
  Tooltip,
  Card,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/useToast";
import EquipoForm from "@/components/equipos/EquipoForm";
import DeleteConfirmationModal from "@/components/equipos/DeleteConfirmationModal";
import { Equipo } from "@/types/models/Equipo";
import { equipoService } from "@/services/equipo.services";
import { SearchIcon } from "@nextui-org/shared-icons";
import { useRouter } from "next/navigation"; // Importamos useRouter para refrescar la página

const ROWS_PER_PAGE = 10;

const columns = [
  { uid: "numero", name: "N°", sortable: false },
  { uid: "nombre", name: "NOMBRE", sortable: true },
  { uid: "descripcion", name: "DESCRIPCIÓN", sortable: true },
  { uid: "actions", name: "ACCIONES", sortable: false },
];

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "nombre",
    direction: "ascending",
  });
  const [loading, setLoading] = useState(true);
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | undefined>();
  const [equipoToDelete, setEquipoToDelete] = useState<Equipo | null>(null);

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { showToast } = useToast();
  const router = useRouter(); // Hook para manejar la navegación y refresco

  const fetchEquipos = async () => {
    try {
      setLoading(true);
      const data = await equipoService.getEquipos();
      setEquipos(data);
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Error",
        description: error.message || "Error al cargar equipos",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEquipos();
  }, []);

  const filteredItems = useMemo(() => {
    let filteredEquipos = [...equipos];
    if (filterValue) {
      filteredEquipos = filteredEquipos.filter((equipo) =>
        equipo.nombre.toLowerCase().includes(filterValue.toLowerCase()) ||
        equipo.descripcion?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredEquipos;
  }, [equipos, filterValue]);

  const pages = Math.ceil(filteredItems.length / ROWS_PER_PAGE) || 1;

  const items = useMemo(() => {
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

  const handleSubmit = async (equipo: Equipo): Promise<boolean> => {    
    try {    
      const equipoData : Equipo = {    
        codEquipo: selectedEquipo?.codEquipo || 0,  
        nombre: equipo.nombre,    
        descripcion: equipo.descripcion,    
        audUsuario: 1,  
         
      };    
    
      await equipoService.register(equipoData);    
        
      showToast({    
        type: 'success',    
        title: 'Éxito',    
        description: equipoData.codEquipo === 0     
          ? 'Equipo registrado correctamente'    
          : 'Equipo actualizado correctamente'    
      });    
        
      await fetchEquipos(); // Refresca los datos localmente  
      onFormClose();    
      setSelectedEquipo(undefined);  
      return true;  
          
    } catch (error: any) {    
      console.error('Error al guardar:', error);  
      showToast({    
        type: 'error',    
        title: 'Error',    
        description: error.message || 'Error al guardar equipo'    
      });  
      return false;  
    }    
  };

  const handleDelete = async () => {
    if (!equipoToDelete?.codEquipo) return;
    try {
      await equipoService.deleteEquipo(equipoToDelete.codEquipo);
      showToast({ type: "success", title: "Éxito", description: "Equipo eliminado correctamente" });
      fetchEquipos();
      onDeleteClose();
      setEquipoToDelete(null);
      router.refresh(); // Refresca la página después de eliminar
    } catch (error: any) {
      showToast({ type: "error", title: "Error", description: error.message || "Error al eliminar equipo" });
    }
  };

  const renderCell = useCallback((equipo: Equipo, columnKey: string) => {
    switch (columnKey) {
      case "numero":
        return (page - 1) * ROWS_PER_PAGE + items.indexOf(equipo) + 1;
      case "nombre":
        return <span className="font-medium">{equipo.nombre}</span>;
      case "descripcion":
        return equipo.descripcion || "-";
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <Tooltip content="Editar" color="primary">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                color="primary"
                onPress={() => {
                  setSelectedEquipo(equipo);
                  onFormOpen();
                }}
              >
                <Icon icon="solar:pen-2-linear" width={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Eliminar" color="danger">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                color="danger"
                onPress={() => {
                  setEquipoToDelete(equipo);
                  onDeleteOpen();
                }}
              >
                <Icon icon="solar:trash-bin-trash-linear" width={18} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        const value = equipo[columnKey as keyof Equipo];
        return value instanceof Date ? value.toLocaleDateString() : value;
    }
  }, [items, page, onFormOpen, onDeleteOpen]);

  const topBar = useMemo(() => (
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
  ), [equipos.length, onFormOpen]);

  const topContent = useMemo(() => (
    <div className="flex items-center gap-4 py-4">
      <Input
        className="max-w-[300px]"
        endContent={<SearchIcon className="text-default-400" width={16} />}
        placeholder="Buscar equipos..."
        size="sm"
        value={filterValue}
        onValueChange={(value) => {
          setFilterValue(value);
          setPage(1);
        }}
      />
    </div>
  ), [filterValue]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" label="Cargando equipos..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {topBar}
      <Card className="p-4">
        <Table
          isHeaderSticky
          aria-label="Tabla de equipos"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
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
            wrapper: "min-h-[222px]",
            th: "bg-primary-50",
            td: "py-3",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                allowsSorting={column.sortable}
                align={column.uid === "actions" ? "end" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No se encontraron equipos"} items={items}>
            {(item) => (
              <TableRow key={item.codEquipo}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey as string)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <EquipoForm
        isOpen={isFormOpen}
        onClose={() => {
          onFormClose();
          setSelectedEquipo(undefined);
        }}
        onSubmit={handleSubmit}
        equipo={selectedEquipo}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
        equipo={equipoToDelete}
      />
    </div>
  );
}