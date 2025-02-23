import { Equipo } from "@/types/models/Equipo";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Tooltip } from "@nextui-org/react";

interface TableActionsProps {  
    equipo: Equipo;  
    onEdit: (equipo: Equipo) => void;  
    onDelete: (equipo: Equipo) => void;  
  }  
    
  export const TableActions = ({ equipo, onEdit, onDelete }: TableActionsProps) => (  
    <div className="flex items-center justify-end gap-2">  
      <Tooltip content="Editar" color="primary">  
        <Button  
          isIconOnly  
          size="sm"  
          variant="flat"  
          color="primary"  
          onPress={() => onEdit(equipo)}  
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
          onPress={() => onDelete(equipo)}  
        >  
          <Icon icon="solar:trash-bin-trash-linear" width={18} />  
        </Button>  
      </Tooltip>  
    </div>  
  );