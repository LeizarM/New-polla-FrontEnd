// src/components/layout/Sidebar.tsx
'use client'

import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  items: Array<{
    key: string;
    title: string;
    icon: string;
  }>;
  defaultSelectedKey?: string;
  selectedKey?: string;
  onSelectionChange?: (key: string) => void;
}

export default function Sidebar({
  items,
  defaultSelectedKey,
  selectedKey: controlledSelectedKey,
  onSelectionChange,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = React.useState(defaultSelectedKey);

  const handleSelectionChange = (key: string) => {
    setSelectedKey(key);
    onSelectionChange?.(key);
    router.push(`/dashboard/${key === 'dashboard' ? '' : key}`);
  };

  const activeKey = controlledSelectedKey || selectedKey;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Button
            key={item.key}
            className={`w-full justify-start text-default-500 data-[hover=true]:text-foreground ${
              pathname === `/dashboard/${item.key === 'dashboard' ? '' : item.key}` 
                ? "bg-primary/10 text-primary" 
                : ""
            }`}
            startContent={
              <Icon
                className={
                  pathname === `/dashboard/${item.key === 'dashboard' ? '' : item.key}`
                    ? "text-primary"
                    : "text-default-500"
                }
                icon={item.icon}
                width={24}
              />
            }
            variant="light"
            onPress={() => handleSelectionChange(item.key)}
          >
            {item.title}
          </Button>
        ))}
      </div>

      <Card className="mx-2 overflow-visible" shadow="sm">
        <CardBody className="items-center py-5 text-center">
          <h3 className="text-medium font-medium text-default-700">
            Premium
            <span aria-label="rocket-emoji" className="ml-2" role="img">
              🚀
            </span>
          </h3>
          <p className="p-4 text-small text-default-500">
            Desbloquea todas las características premium.
          </p>
        </CardBody>
        <CardFooter className="absolute -bottom-8 justify-center">
          <Button
            className="px-10 shadow-md"
            color="primary"
            radius="full"
            variant="shadow"
          >
            Actualizar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}