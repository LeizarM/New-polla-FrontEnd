// src/components/equipos/DeleteConfirmationModal.tsx
'use client'

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import { Icon } from "@iconify/react";
import { Equipo } from '@/types/models/Equipo';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  equipo: Equipo | null;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  equipo
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirmar eliminación
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3">
                <Icon 
                  icon="solar:danger-triangle-bold-duotone" 
                  className="text-danger mx-auto" 
                  width={64} 
                  height={64} 
                />
                <p className="text-center">
                  ¿Está seguro que desea eliminar el equipo{" "}
                  <span className="font-bold text-danger">
                    {equipo?.nombre}
                  </span>
                  ?
                </p>
                <p className="text-center text-small text-default-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button
                color="danger"
                variant="solid"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                startContent={<Icon icon="solar:trash-bin-trash-bold-duotone" />}
              >
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}