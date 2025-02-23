// src/app/dashboard/apuestas/page.tsx
'use client'

import React from 'react';
import {
  Card,
  CardBody,
  
  Button,
  Input,
  Tabs,
  Tab,
  Chip,
 
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from '@nextui-org/react';
import { Icon } from "@iconify/react";


export default function ApuestasPage() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [selectedMatch, setSelectedMatch] = React.useState<typeof matches[0] | null>(null);

  const matches = [
    {
      id: 1,
      tournament: "Mundial 2026",
      date: new Date("2024-06-01T15:00:00"),
      team1: {
        name: "Brasil",
        image: "https://via.placeholder.com/50",
        odds: 1.85
      },
      team2: {
        name: "Argentina",
        image: "https://via.placeholder.com/50",
        odds: 2.10
      },
      drawOdds: 3.25,
      status: "upcoming" // upcoming, live, finished
    },
    // ... más partidos
  ];

  const myBets = [
    {
      id: 1,
      match: {
        team1: "Brasil",
        team2: "Argentina",
        date: new Date("2024-06-01T15:00:00"),
      },
      prediction: "team1",
      amount: 100,
      potentialWin: 185,
      status: "pending", // pending, won, lost
      odds: 1.85
    },
    // ... más apuestas
  ];

  const BetModal = () => {
    if (!selectedMatch) return null;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Realizar Apuesta
            <span className="text-small text-default-500">
              {selectedMatch.tournament}
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-center space-y-2">
                <Avatar
                  src={selectedMatch.team1.image}
                  className="w-20 h-20"
                />
                <p className="font-semibold">{selectedMatch.team1.name}</p>
                <Chip
                  className="cursor-pointer"
                  color="primary"
                  variant="flat"
                >
                  {selectedMatch.team1.odds}x
                </Chip>
              </div>

              <div className="text-center space-y-2">
                <div className="w-20 h-20 mx-auto flex items-center justify-center">
                  <Icon icon="solar:ball-bold-duotone" width={40} />
                </div>
                <p className="font-semibold">Empate</p>
                <Chip
                  className="cursor-pointer"
                  color="primary"
                  variant="flat"
                >
                  {selectedMatch.drawOdds}x
                </Chip>
              </div>

              <div className="text-center space-y-2">
                <Avatar
                  src={selectedMatch.team2.image}
                  className="w-20 h-20"
                />
                <p className="font-semibold">{selectedMatch.team2.name}</p>
                <Chip
                  className="cursor-pointer"
                  color="primary"
                  variant="flat"
                >
                  {selectedMatch.team2.odds}x
                </Chip>
              </div>
            </div>

            <Divider className="my-4" />

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-default-500">Monto a apostar</p>
                <Input
                  type="number"
                  placeholder="0.00"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  endContent={
                    <div className="flex gap-2">
                      <Button size="sm">+10</Button>
                      <Button size="sm">+50</Button>
                      <Button size="sm">+100</Button>
                    </div>
                  }
                />
              </div>

              <div className="bg-default-100 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Ganancia potencial</span>
                  <span className="font-bold text-success">$185.00</span>
                </div>
                <div className="flex justify-between text-small text-default-500">
                  <span>Cuota</span>
                  <span>1.85x</span>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={onClose}>
              Confirmar Apuesta
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Apuestas</h1>
            <p className="text-default-500">Partidos disponibles y tus apuestas activas</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="flat"
              startContent={<Icon icon="solar:wallet-money-bold-duotone" />}
            >
              $1,500.00
            </Button>
          </div>
        </div>

        <Tabs 
          aria-label="Opciones"
          classNames={{
            tabList: "gap-4",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-8",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          <Tab
            key="disponibles"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="solar:ticket-star-bold-duotone" />
                <span>Disponibles</span>
                <Chip size="sm" variant="flat">{matches.length}</Chip>
              </div>
            }
          >
            <div className="grid gap-4 mt-4 md:grid-cols-2">
              {matches.map((match) => (
                <Card
                  key={match.id}
                  isPressable
                  onPress={() => {
                    setSelectedMatch(match);
                    onOpen();
                  }}
                >
                  <CardBody>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:cup-star-bold-duotone" className="text-primary" />
                          <span className="text-small text-default-500">
                            {match.tournament}
                          </span>
                        </div>
                        {match.status === 'live' && (
                          <Chip color="danger" variant="flat" size="sm">
                            EN VIVO
                          </Chip>
                        )}
                      </div>

                      <div className="grid grid-cols-3 items-center text-center">
                        <div className="space-y-2">
                          <Avatar src={match.team1.image} className="w-16 h-16" />
                          <p className="font-semibold">{match.team1.name}</p>
                          <Chip color="primary" variant="flat">
                            {match.team1.odds}x
                          </Chip>
                        </div>

                        <div>
                          <div className="bg-default-100 rounded-lg py-2 px-4">
                            <p className="text-small text-default-500">
                              {match.date.toLocaleDateString()}
                            </p>
                            <p className="font-bold">VS</p>
                            <Chip color="primary" variant="flat" size="sm">
                              {match.drawOdds}x
                            </Chip>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Avatar src={match.team2.image} className="w-16 h-16" />
                          <p className="font-semibold">{match.team2.name}</p>
                          <Chip color="primary" variant="flat">
                            {match.team2.odds}x
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Tab>

          <Tab
            key="mis-apuestas"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="solar:ticket-check-bold-duotone" />
                <span>Mis Apuestas</span>
                <Chip size="sm" variant="flat">{myBets.length}</Chip>
              </div>
            }
          >
            <div className="space-y-4 mt-4">
              {myBets.map((bet) => (
                <Card key={bet.id}>
                  <CardBody>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-small text-default-500">
                          {bet.match.date.toLocaleDateString()}
                        </p>
                        <p className="font-semibold">
                          {bet.match.team1} vs {bet.match.team2}
                        </p>
                        <div className="flex gap-2">
                          <Chip size="sm" variant="flat">
                            {bet.prediction === 'team1' ? bet.match.team1 : 
                             bet.prediction === 'team2' ? bet.match.team2 : 
                             'Empate'}
                          </Chip>
                          <Chip size="sm" variant="flat">
                            {bet.odds}x
                          </Chip>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="text-small text-default-500">Apostado</p>
                        <p className="font-bold">${bet.amount}</p>
                        <p className="text-small text-success">
                          Potencial: ${bet.potentialWin}
                        </p>
                      </div>

                      <Chip
                        className="ml-4"
                        color={
                          bet.status === 'won' ? 'success' :
                          bet.status === 'lost' ? 'danger' :
                          'warning'
                        }
                      >
                        {bet.status === 'won' ? 'Ganada' :
                         bet.status === 'lost' ? 'Perdida' :
                         'Pendiente'}
                      </Chip>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Tab>
        </Tabs>

        <BetModal />
      </div>
   
  );
}