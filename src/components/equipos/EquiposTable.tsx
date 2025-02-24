// src/components/equipos/EquiposTable.tsx
'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Pagination,
  SortDescriptor,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Equipo } from '@/types/models/Equipo';

interface EquiposTableProps {
  items: Equipo[];
  page: number;
  total: number;
  sortDescriptor: SortDescriptor;
  onPageChange: (page: number) => void;
  onSortChange: (descriptor: SortDescriptor) => void;
  onEdit: (equipo: Equipo) => void;
  onDelete: (equipo: Equipo) => void;
}

const columns = [
  { uid: "numero", name: "N°", sortable: false },
  { uid: "nombre", name: "NOMBRE", sortable: true },
  { uid: "descripcion", name: "DESCRIPCIÓN", sortable: true },
  { uid: "actions", name: "ACCIONES", sortable: false },
];

export const EquiposTable: React.FC<EquiposTableProps> = ({
  items,
  page,
  total,
  sortDescriptor,
  onPageChange,
  onSortChange,
  onEdit,
  onDelete,
}) => {
  const renderCell = React.useCallback((equipo: Equipo, columnKey: string) => {
    const cellValue = equipo[columnKey as keyof Equipo];

    switch (columnKey) {
      case "numero":
        return (page - 1) * 10 + items.indexOf(equipo) + 1;
      
      case "nombre":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize text-gray-100">{equipo.nombre}</p>
          </div>
        );
      
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
                onPress={() => onEdit(equipo)}
              >
                <Icon icon="solar:pen-2-linear" width={18} className="text-white" />
              </Button>
            </Tooltip>
            <Tooltip content="Eliminar" color="danger">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                color="danger"
                onPress={() => onDelete(equipo)}
              >
                <Icon icon="solar:trash-bin-trash-linear" width={18} className="text-white" />
              </Button>
            </Tooltip>
          </div>
        );
      
      default:
        if (cellValue instanceof Date) {
          return cellValue.toLocaleString();
        }
        return cellValue;
    }
  }, [items, page, onEdit, onDelete]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex justify-center py-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={total}
          onChange={onPageChange}
          classNames={{
            cursor: "bg-blue-500 text-white",
            item: "text-gray-200 hover:bg-gray-700",
          }}
        />
      </div>
    );
  }, [page, total, onPageChange]);

  return (
    <Table
      isHeaderSticky
      aria-label="Tabla de equipos"
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
      bottomContent={total > 1 ? bottomContent : null}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "min-h-[300px] p-2",
        th: "bg-blue-800 text-white font-medium",
        td: "py-3 text-gray-200",
        tr: "hover:bg-gray-700",
       
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
      <TableBody 
        emptyContent={"No se encontraron equipos"} 
        items={items}
      >
        {(item) => (
          <TableRow key={item.codEquipo}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as string)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EquiposTable;