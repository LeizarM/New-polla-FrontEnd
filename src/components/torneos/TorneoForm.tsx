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
import { torneoService } from '@/services/torneo.services';
import { toast } from 'sonner';

interface TorneoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  torneo?: Torneo;
}

// Valores por defecto para un nuevo torneo
const defaultValues = {
  nombre: '',
  fechaInicio: new Date(),
  fechaFin: new Date(),
  montoTotal: 0,
  montoFecha: 0,
  montoPolla: 0,
  finalizado: 'NO',
};

export default function TorneoForm({ isOpen, onClose, onSuccess, torneo }: TorneoFormProps) {
  // Inyectar estilos para DatePicker
  useInjectStyles(datePickerStyles, 'react-datepicker-styles');

  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Form hook
  const { control, handleSubmit, reset, formState: { errors } } = useForm<Torneo>({
    defaultValues
  });

  // Estados para las fechas y validaciones
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [fechaInicioError, setFechaInicioError] = useState<string>("");
  const [fechaFinError, setFechaFinError] = useState<string>("");

  // Inicializar formulario con datos del torneo (si existe) o valores por defecto
  useEffect(() => {
    console.log("isOpen:", isOpen, "torneo:", torneo ? "Sí" : "No");
    
    // Asegurar que se limpien correctamente los campos cuando se abre para un nuevo torneo
    if (isOpen) {
      if (torneo) {
        // Editar torneo existente
        const fechaInicioDate = parseDate(torneo.fechaInicio) || new Date();
        const fechaFinDate = parseDate(torneo.fechaFin) || new Date();
        
        console.log("Editando torneo:", torneo.nombre);
        
        setFechaInicio(fechaInicioDate);
        setFechaFin(fechaFinDate);
        
        reset({
          ...torneo,
          fechaInicio: fechaInicioDate,
          fechaFin: fechaFinDate,
        });
      } else {
        // Nuevo torneo - limpiar completamente el formulario
        console.log("Creando nuevo torneo, limpiando formulario");
        
        const now = new Date();
        setFechaInicio(now);
        setFechaFin(now);
        
        // Restablecer todos los campos a sus valores por defecto
        reset(defaultValues);
      }
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
  const onFormSubmit = async (formData: any) => {
    try {
      if (!validateDates()) return;
      
      setIsLoading(true);
      
      const torneoData: Torneo = {
        ...formData,
        codTorneo: torneo?.codTorneo || 0,
        fechaInicio,
        fechaFin,
      };
      
      console.log("Enviando datos de torneo:", torneoData);
      
      // Usar el servicio para registrar o actualizar
      const response = await torneoService.register(torneoData);
      
      if (response.success) {
        toast.success(response.message || (torneo ? 'Torneo actualizado correctamente' : 'Torneo creado correctamente'));
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message || 'Error al procesar la solicitud');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la solicitud');
      console.error('Error al guardar torneo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar el formulario al cerrar el modal
  const handleClose = () => {
    // No es necesario limpiar aquí porque limpiaremos al volver a abrir
    onClose();
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
      onClose={handleClose}
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
            <Button 
              variant="light" 
              onPress={handleClose} 
              className="text-gray-300 hover:text-white"
              isDisabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
              endContent={!isLoading && <Icon icon="solar:check-circle-bold" width={20} />}
            >
              {torneo ? 'Actualizar' : 'Crear'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}