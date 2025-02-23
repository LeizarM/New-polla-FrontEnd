
// src/components/equipos/EquipoForm.tsx
'use client'

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from '@nextui-org/react';
import { Equipo } from '@/types/models/Equipo';
import { useToast } from '@/hooks/useToast';
import { Icon } from "@iconify/react";

interface EquipoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (equipo: Equipo) => void;
  equipo?: Equipo;
}

export default function EquipoForm({ isOpen, onClose, onSubmit, equipo }: EquipoFormProps) {
  const [formData, setFormData] = React.useState<Partial<Equipo>>({
    codEquipo: equipo?.codEquipo || 0,
    nombre: equipo?.nombre || '',
    descripcion: equipo?.descripcion || '',
    
    audUsuario: equipo?.audUsuario,
    audFecha: equipo?.audFecha,
  });
  const [isInvalid, setIsInvalid] = React.useState(false);
  const { showToast } = useToast();

  React.useEffect(() => {
    if (isOpen) {
      if (equipo) {
        setFormData({
          codEquipo: equipo.codEquipo,
          nombre: equipo.nombre,
          descripcion: equipo.descripcion,
         
          audUsuario: equipo.audUsuario,
          audFecha: equipo.audFecha,
        });
      } else {
        setFormData({
          codEquipo: 0,
          nombre: '',
          descripcion: '',
          
        });
      }
      setIsInvalid(false);
    }
  }, [isOpen, equipo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsInvalid(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.descripcion) {
      setIsInvalid(true);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Todos los campos son obligatorios',
      });
      return;
    }

    // Asegurar que se envíen todos los campos necesarios
    const equipoToSubmit: Equipo = {
      codEquipo: formData.codEquipo || 0,
      nombre: formData.nombre!,
      descripcion: formData.descripcion!,
      
      audUsuario: formData.audUsuario || 1, // Valor por defecto o del usuario actual
      audFecha: new Date(), // Fecha actual al momento de enviar
    };

    onSubmit(equipoToSubmit);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-xl shadow-lg",
        header: "pb-3",
        body: "py-6",
        footer: "pt-4",
        closeButton: "hover:bg-primary-100",
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon 
                icon={equipo ? "solar:pen-2-bold-duotone" : "solar:add-circle-bold-duotone"} 
                className="text-primary"
              />
              {equipo ? 'Editar Equipo' : 'Nuevo Equipo'}
            </h2>
          </ModalHeader>
          
          <ModalBody>
            <div className="space-y-6">
              <Input
                label="Nombre"
                placeholder="Ingrese el nombre del equipo"
                value={formData.nombre || ''}
                onChange={handleInputChange}
                name="nombre"
                isRequired
                variant="bordered"
                isInvalid={isInvalid && !formData.nombre}
                errorMessage={isInvalid && !formData.nombre ? "Campo obligatorio" : ""}
                startContent={<Icon icon="solar:user-bold-duotone" />}
                classNames={{
                  label: "font-medium text-default-700",
                  inputWrapper: "shadow-sm",
                }}
                fullWidth
              />
              
              <Textarea
                label="Descripción"
                placeholder="Ingrese la descripción del equipo"
                value={formData.descripcion || ''}
                onChange={handleInputChange}
                name="descripcion"
                isRequired
                variant="bordered"
                isInvalid={isInvalid && !formData.descripcion}
                errorMessage={isInvalid && !formData.descripcion ? "Campo obligatorio" : ""}
                classNames={{
                  label: "font-medium text-default-700",
                  inputWrapper: "shadow-sm",
                }}
                minRows={3}
                fullWidth
              />

              
            </div>
          </ModalBody>
          
          <ModalFooter className="flex justify-end gap-3">
            <Button 
              color="danger" 
              variant="light" 
              onPress={onClose}
              startContent={<Icon icon="solar:close-circle-bold-duotone" />}
            >
              Cancelar
            </Button>
            <Button 
              color="primary" 
              type="submit"
              className="shadow-md"
              startContent={<Icon icon="solar:disk-bold-duotone" />}
            >
              {equipo ? 'Guardar Cambios' : 'Guardar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}