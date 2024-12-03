import React from 'react';
import { Ticket, DoorOpen, Power } from 'lucide-react';

interface EventActionsProps {
  eventId: string;
  onEventIdChange: (value: string) => void;
  onBuyTicket: () => void;
  onEnterEvent: () => void;
  onEndEvent: () => void;
}

export function EventActions({ 
  eventId, 
  onEventIdChange, 
  onBuyTicket, 
  onEnterEvent,
  onEndEvent
}: EventActionsProps) {
  return (
    <div className="space-y-4 mt-6">
      <button
        onClick={onBuyTicket}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
      >
        <Ticket size={20} />
        Buy Ticket (0.01 MATIC)
      </button>

      <div className="space-y-2">
        <input
          type="text"
          value={eventId}
          onChange={(e) => onEventIdChange(e.target.value)}
          placeholder="Enter Event ID"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={onEnterEvent}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <DoorOpen size={20} />
          Enter Event
        </button>
        
        <button
          onClick={onEndEvent}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 mt-4"
        >
          <Power size={20} />
          End Event
        </button>
      </div>
    </div>
  );
}