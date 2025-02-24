// src/components/torneos/TorneoForm.tsx
'use client'

import React, { useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  DatePicker,
  Switch,
  DateValue,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { useForm, Controller } from 'react-hook-form';
import { Torneo } from '@/types/models/Torneo';

interface TorneoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Torneo) => Promise<boolean>;
  torneo?: Torneo;
}

export default function TorneoForm({ isOpen, onClose, onSubmit, torneo }: TorneoFormProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<Torneo>({
    defaultValues: {
      nombre: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      montoTotal: 0,
      montoFecha: 0,
      montoPolla: 0,
      finalizado: false,
    }
  });

  useEffect(() => {
    if (torneo) {
      reset({
        nombre: torneo.nombre,
        fechaInicio: torneo.fechaInicio ? new Date(torneo.fechaInicio) : new Date(),
        fechaFin: torneo.fechaFin ? new Date(torneo.fechaFin) : new Date(),
        montoTotal: torneo.montoTotal,
        montoFecha: torneo.montoFecha,
        montoPolla: torneo.montoPolla,
        finalizado: torneo.finalizado,
      });
    } else {
      reset({
        nombre: '',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        montoTotal: 0,
        montoFecha: 0,
        montoPolla: 0,
        finalizado: false,
      });
    }
  }, [torneo, reset]);

  const onFormSubmit = async (data: Torneo) => {
    const torneoData: Torneo = {
      ...data,
      codTorneo: torneo?.codTorneo,
    };
    
    const success = await onSubmit(torneoData);
    if (success) {
      onClose();
    }
  };

  // Función para convertir DateValue a Date
  const dateValueToDate = (dateValue: DateValue | null): Date => {
    if (!dateValue) return new Date();
    return new Date(dateValue.year, dateValue.month - 1, dateValue.day);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      classNames={{
        base: "bg-gray-900 text-white", // Fondo gris oscuro y texto blanco
        header: "border-b border-gray-700", // Borde oscuro
        footer: "border-t border-gray-700", // Borde oscuro
        body: "text-gray-200", // Texto claro en el cuerpo
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <ModalHeader className="flex items-center gap-2">
            <Icon icon="solar:trophy-bold" className="text-primary" width={24} />
            <span>{torneo ? 'Editar Torneo' : 'Nuevo Torneo'}</span>
          </ModalHeader>

          <ModalBody className="py-6">
            <div className="space-y-6">
              <Controller
                name="nombre"
                control={control}
                rules={{ required: 'El nombre del torneo es requerido' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nombre del Torneo"
                    placeholder="Ej: Copa América 2025"
                    variant="bordered"
                    isInvalid={!!errors.nombre}
                    errorMessage={errors.nombre?.message}
                    classNames={{
                      input: "text-gray-200", // Texto claro dentro del input
                      label: "text-gray-400", // Label en gris claro
                      inputWrapper: "bg-gray-800 border-gray-600", // Fondo oscuro y borde
                      errorMessage: "text-red-400", // Mensaje de error en rojo claro
                    }}
                  />
                )}
              />

              <Controller
                name="fechaInicio"
                control={control}
                rules={{ required: 'La fecha de inicio es requerida' }}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de Inicio"
                    variant="bordered"
                    onChange={(value: DateValue | null) => field.onChange(dateValueToDate(value))}
                    isInvalid={!!errors.fechaInicio}
                    errorMessage={errors.fechaInicio?.message}
                    className="w-full"
                    classNames={{
                      input: "text-gray-200",
                      label: "text-gray-400",
                      selectorButton: "text-gray-200",
                      inputWrapper: "bg-gray-800 border-gray-600",
                      errorMessage: "text-red-400",
                    }}
                  />
                )}
              />

              <Controller
                name="fechaFin"
                control={control}
                rules={{
                  required: 'La fecha de fin es requerida',
                  validate: (value) => value ? value >= control._formValues.fechaInicio || 'La fecha de fin debe ser posterior a la de inicio' : true,
                }}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de Fin"
                    variant="bordered"
                    onChange={(value: DateValue | null) => field.onChange(dateValueToDate(value))}
                    isInvalid={!!errors.fechaFin}
                    errorMessage={errors.fechaFin?.message}
                    className="w-full"
                    classNames={{
                      input: "text-gray-200",
                      label: "text-gray-400",
                      selectorButton: "text-gray-200",
                      inputWrapper: "bg-gray-800 border-gray-600",
                      errorMessage: "text-red-400",
                    }}
                  />
                )}
              />

              <Controller
                name="montoTotal"
                control={control}
                rules={{
                  required: 'El monto total es requerido',
                  min: { value: 0, message: 'El monto debe ser mayor o igual a 0' },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    value={field.value?.toString()}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    label="Monto Total ($)"
                    placeholder="Ej: 5"
                    variant="bordered"
                    startContent={<span className="text-gray-400">$</span>}
                    isInvalid={!!errors.montoTotal}
                    errorMessage={errors.montoTotal?.message}
                    classNames={{
                      input: "text-gray-200",
                      label: "text-gray-400",
                      inputWrapper: "bg-gray-800 border-gray-600",
                      errorMessage: "text-red-400",
                    }}
                  />
                )}
              />

              <Controller
                name="montoFecha"
                control={control}
                rules={{
                  required: 'El monto por fecha es requerido',
                  min: { value: 0, message: 'El monto debe ser mayor o igual a 0' },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    value={field.value?.toString()}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    label="Monto por Fecha ($)"
                    placeholder="Ej: 2"
                    variant="bordered"
                    startContent={<span className="text-gray-400">$</span>}
                    isInvalid={!!errors.montoFecha}
                    errorMessage={errors.montoFecha?.message}
                    classNames={{
                      input: "text-gray-200",
                      label: "text-gray-400",
                      inputWrapper: "bg-gray-800 border-gray-600",
                      errorMessage: "text-red-400",
                    }}
                  />
                )}
              />

              <Controller
                name="montoPolla"
                control={control}
                rules={{
                  required: 'El monto de la polla es requerido',
                  min: { value: 0, message: 'El monto debe ser mayor o igual a 0' },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    value={field.value?.toString()}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    label="Monto de la Polla ($)"
                    placeholder="Ej: 3"
                    variant="bordered"
                    startContent={<span className="text-gray-400">$</span>}
                    isInvalid={!!errors.montoPolla}
                    errorMessage={errors.montoPolla?.message}
                    classNames={{
                      input: "text-gray-200",
                      label: "text-gray-400",
                      inputWrapper: "bg-gray-800 border-gray-600",
                      errorMessage: "text-red-400",
                    }}
                  />
                )}
              />

              <Controller
                name="finalizado"
                control={control}
                render={({ field }) => (
                  <Switch
                    isSelected={field.value}
                    onValueChange={field.onChange}
                    color="success"
                    size="sm"
                    className="text-gray-200"
                  >
                    Finalizado
                  </Switch>
                )}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="light"
              onPress={onClose}
              className="text-gray-300 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              endContent={<Icon icon="solar:check-circle-bold" width={20} />}
            >
              {torneo ? 'Actualizar' : 'Crear'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}