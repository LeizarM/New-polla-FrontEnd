// src/components/layout/DashboardLayout.tsx
'use client'

import React from "react";
import {
  Button,
  Input,
  ScrollShadow,
  Spacer,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/AuthProvider";
import { items } from "./sidebar-items";
import Sidebar from "./Sidebar";
import UserInfo from "./UserInfo";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="relative flex h-full w-72 flex-col border-r-small border-divider bg-background p-6">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="text-background font-bold">A</span>
          </div>
          <span className="text-small font-bold uppercase">Admin</span>
        </div>
        
        <Spacer y={8} />
        
        <div className="flex flex-col gap-4">
          <UserInfo />
          <Input
            fullWidth
            aria-label="search"
            className="px-1"
            labelPlacement="outside"
            placeholder="Buscar..."
            startContent={
              <Icon
                className="text-default-500 [&>g]:stroke-[2px]"
                icon="solar:magnifer-linear"
                width={18}
              />
            }
          />
        </div>

        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar defaultSelectedKey="home" items={items} />
        </ScrollShadow>

        <Spacer y={8} />

        <div className="mt-auto flex flex-col">
          <Button
            fullWidth
            className="justify-start text-default-500 data-[hover=true]:text-foreground"
            startContent={
              <Icon className="text-default-500" icon="solar:info-circle-line-duotone" width={24} />
            }
            variant="light"
          >
            Ayuda e Información
          </Button>
          <Button
            className="justify-start text-default-500 data-[hover=true]:text-foreground"
            startContent={
              <Icon
                className="text-default-500"
                icon="solar:logout-2-line-duotone"
                width={24}
              />
            }
            variant="light"
            onPress={logout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}