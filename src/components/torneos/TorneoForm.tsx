'use client'

import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { useForm, Controller } from 'react-hook-form';
import { Torneo } from '@/types/models/Torneo';
import CustomDatePicker, { datePickerStyles } from '@/components/ui/CustomDatePicker';
import { inputClassNames } from '@/components/ui/constants';
import { parseDate, validateDateRange } from '@/utils/dateUtils';
import useInjectStyles from '@/hooks/useInjectStyles';

interface TorneoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Torneo) => Promise<boolean>;
  torneo?: Torneo;
}

export default function TorneoForm({ isOpen, onClose, onSubmit, torneo }: TorneoFormProps) {
  // Inyectar estilos para DatePicker
  useInjectStyles(datePickerStyles, 'react-datepicker-styles');

  // Form hook
  const { control, handleSubmit, reset, formState: { errors } } = useForm<Torneo>({
    defaultValues: {
      nombre: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      montoTotal: 0,
      montoFecha: 0,
      montoPolla: 0,
      finalizado: 'NO',
    }
  });

  // Estados para las fechas y validaciones
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [fechaInicioError, setFechaInicioError] = useState<string>("");
  const [fechaFinError, setFechaFinError] = useState<string>("");

  // Inicializar formulario con datos del torneo (si existe)
  useEffect(() => {
    if (torneo) {
      const fechaInicioDate = parseDate(torneo.fechaInicio) || new Date();
      const fechaFinDate = parseDate(torneo.fechaFin) || new Date();
      
      setFechaInicio(fechaInicioDate);
      setFechaFin(fechaFinDate);
      
      reset({
        ...torneo,
        fechaInicio: fechaInicioDate,
        fechaFin: fechaFinDate,
      });
    } else {
      const now = new Date();
      setFechaInicio(now);
      setFechaFin(now);
      reset();
    }
  }, [torneo, reset, isOpen]);

  // Validar fechas
  const validateDates = (): boolean => {
    setFechaInicioError("");
    setFechaFinError("");
    
    if (!fechaInicio) {
      setFechaInicioError("La fecha de inicio es requerida");
      return false;
    }
    
    if (!fechaFin) {
      setFechaFinError("La fecha de fin es requerida");
      return false;
    }
    
    if (!validateDateRange(fechaInicio, fechaFin)) {
      setFechaFinError("La fecha de fin debe ser posterior a la de inicio");
      return false;
    }
    
    return true;
  };

  // Manejar envío del formulario
  const onFormSubmit = (formData: any) => {
    if (!validateDates()) return;
    
    const torneoData: Torneo = {
      ...formData,
      codTorneo: torneo?.codTorneo,
      fechaInicio,
      fechaFin,
    };
    
    onSubmit(torneoData).then(success => {
      if (success) onClose();
    });
  };

  // Renderizar campos de montos
  const renderMontoInputs = () => {
    const montoFields = ['montoTotal', 'montoFecha', 'montoPolla'];
    
    return montoFields.map((fieldName) => (
      <Controller
        key={fieldName}
        name={fieldName as keyof Torneo}
        control={control}
        rules={{
          required: `Este campo es requerido`,
          min: { value: 0, message: 'Debe ser mayor o igual a 0' }
        }}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            value={field.value?.toString()}
            onChange={(e) => field.onChange(Number(e.target.value))}
            label={`Monto ${fieldName.replace('monto', '')}`}
            variant="bordered"
            isInvalid={!!errors[fieldName as keyof typeof errors]}
            errorMessage={errors[fieldName as keyof typeof errors]?.message}
            classNames={inputClassNames}
          />
        )}
      />
    ));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      classNames={{
        base: "bg-gray-900 text-white",
        header: "border-b border-gray-700",
        footer: "border-t border-gray-700",
        body: "text-gray-200",
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
              {/* Campo Nombre */}
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
                    classNames={inputClassNames}
                  />
                )}
              />

              {/* Fecha Inicio */}
              <div className="w-full">
                <CustomDatePicker
                  label="Fecha de Inicio"
                  selected={fechaInicio}
                  onChange={(date: Date) => setFechaInicio(date)}
                  isInvalid={!!fechaInicioError}
                  errorMessage={fechaInicioError}
                />
              </div>

              {/* Fecha Fin */}
              <div className="w-full">
                <CustomDatePicker
                  label="Fecha de Fin"
                  selected={fechaFin}
                  onChange={(date: Date) => setFechaFin(date)}
                  isInvalid={!!fechaFinError}
                  errorMessage={fechaFinError}
                  minDate={fechaInicio}
                />
              </div>

              {/* Campos de Montos */}
              {renderMontoInputs()}

              {/* Switch Finalizado */}
              <Controller
                name="finalizado"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Switch
                      isSelected={field.value === 'SI'}
                      onValueChange={(checked) => field.onChange(checked ? 'SI' : 'NO')}
                      color="success"
                      size="sm"
                    />
                    <span className="text-gray-200">Finalizado</span>
                  </div>
                )}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={onClose} className="text-gray-300 hover:text-white">
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