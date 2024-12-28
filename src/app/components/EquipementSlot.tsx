'use client';

import { useState } from 'react';

interface EquipementSlotProps {
  slotId: string;
  slotName: string;
  onLevelChange: (slot: string, level: number) => void;
  className: string;
}

export default function EquipementSlot({ slotId, slotName, onLevelChange, className }: EquipementSlotProps) {
  const [level, setLevel] = useState<number | ''>('');

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setLevel(isNaN(value) ? '' : value);
    onLevelChange(slotId, isNaN(value) ? 0 : value);
  };

  return (
    <div className={`${className} flex flex-col items-center`}>
      <label className="text-xs font-semibold mb-1">{slotName}</label>
      <input
        type="number"
        value={level}
        onChange={handleLevelChange}
        className="w-16 border p-1 text-center rounded"
        placeholder="Niv."
        min="1"
      />
    </div>
  );
}
