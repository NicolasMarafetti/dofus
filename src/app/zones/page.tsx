/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import NavBar from '../components/NavBar';

interface Monster {
  id: number;
  name: string;
  averageKillPrice: number;
}

interface Zone {
  id: number;
  name: string;
  monsters: Monster[];
}

export default function Zones() {
  const [zones, setZones] = useState<Zone[]>([
    {
      id: 1,
      name: 'Plaine des Scarafeuilles',
      monsters: [
        { id: 1, name: 'Scarafeuille Bleu', averageKillPrice: 200 },
        { id: 2, name: 'Scarafeuille Vert', averageKillPrice: 180 },
      ],
    },
    {
      id: 2,
      name: 'Forêt d’Amakna',
      monsters: [
        { id: 3, name: 'Sanglier', averageKillPrice: 150 },
        { id: 4, name: 'Tofu', averageKillPrice: 120 },
      ],
    },
  ]);

  const calculateZoneAveragePrice = (zone: Zone) => {
    const total = zone.monsters.reduce((sum, monster) => sum + monster.averageKillPrice, 0);
    return (total / zone.monsters.length).toFixed(2);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-500 mb-6">🌍 Zones</h1>
        <p className="text-lg text-gray-700 mb-8">
          Analysez les zones et optimisez vos sessions de farm en fonction des prix moyens des kills.
        </p>

        <div className="space-y-6">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white shadow-md rounded-lg p-6 hover:bg-blue-50 transition"
            >
              <h2 className="text-2xl font-semibold text-blue-500 mb-2">{zone.name}</h2>
              <p className="text-gray-600 mb-4">
                Prix moyen par kill : <strong>{calculateZoneAveragePrice(zone)} kamas</strong>
              </p>
              <ul className="list-disc pl-5 text-gray-700">
                {zone.monsters.map((monster) => (
                  <li key={monster.id}>
                    {monster.name} : {monster.averageKillPrice} kamas
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
