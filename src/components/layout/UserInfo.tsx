// src/components/layout/UserInfo.tsx
'use client'

import React from "react";
import { Avatar } from "@nextui-org/react";
import { useAuth } from "@/context/AuthProvider";

export default function UserInfo() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-3 px-2">
      <Avatar
        isBordered
        size="sm"
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.username || ""
        )}&background=random`}
      />
      <div className="flex flex-col">
        <p className="text-small font-medium text-default-600">
          {user?.username}
        </p>
        <p className="text-tiny text-default-400">
          {user?.esAdmin ? "Administrador" : "Usuario"}
        </p>
      </div>
    </div>
  );
}