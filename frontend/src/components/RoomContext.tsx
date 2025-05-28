// RoomContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface Room {
  _id: string;
  roomNumber: string;
  floor: number;
  status: 'occupied' | 'vacant';
  price: number;
  bathrooms: number;
  showerRooms: number;
  tenant?: {
    _id: string;
    name: string;
    citizenId: string;
    phone: string;
    email: string;
    moveInDate: string;
    oldMeterReading?: number;
    newMeterReading?: number;
    totalCost?: number;
    isPaid?: boolean;
  };
}

interface RoomContextType {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};