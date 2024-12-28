'use client';

import { useState } from 'react';
import EquipementPanel from '../components/EquipementPanel';
import NavBar from '../components/NavBar';

export default function EquipementPage() {
  const [equipementLevels, setEquipementLevels] = useState<{ [key: string]: number }>({});

  const handleEquipementChange = (slot: string, level: number) => {
    setEquipementLevels((prev) => ({ ...prev, [slot]: level }));
  };

  const calculateAverageLevel = () => {
    const levels = Object.values(equipementLevels).filter((level) => level > 0);
    if (levels.length === 0) return 0;
    return (levels.reduce((sum, lvl) => sum + lvl, 0) / levels.length).toFixed(2);
  };

  return (
    <div className="flex flex-col">
        <NavBar />
      <h1 className="text-2xl font-bold mb-4">Panneau d'Équipement</h1>
      <EquipementPanel onEquipementChange={handleEquipementChange} />
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Niveau Moyen de l'Équipement :</h2>
        <p className="text-2xl font-bold">{calculateAverageLevel()}</p>
      </div>
    </div>
  );
}
