'use client';

import CopyButton from '@/app/components/CopyButton';
import NavBar from '@/app/components/NavBar';
import { Effect } from '@/app/interfaces/item';
import { calculateEffectPower, calculateItemPower } from '@/app/utils/item';
import { Item } from '@prisma/client';
import React, { useState } from 'react';

const PowerItemsPage: React.FC = () => {
  const [characterLevel, setCharacterLevel] = useState<number | ''>('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItemsByPower = async () => {
    if (characterLevel === '') return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/items/power?level=${characterLevel}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des objets.');
      }

      const data = await response.json();
      setItems(data.items);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Une erreur inconnue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Objets Triés par Puissance</h1>
        <div className="mb-4">
          <label htmlFor="level" className="block mb-2">Niveau du personnage :</label>
          <input
            type="number"
            id="level"
            value={characterLevel}
            onChange={(e) => setCharacterLevel(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Entrez votre niveau"
            className="border p-2 rounded w-full max-w-md"
          />
          <button
            onClick={fetchItemsByPower}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading || characterLevel === ''}
          >
            {loading ? 'Chargement...' : 'Rechercher'}
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <ul className="mt-4">
          {items.length > 0 ? (
            items.map((item) => {
              if (!item.effects) return null;

              const itemEffects = JSON.parse(item.effects as string);

              return (
                <li key={item.id} className="border p-2 mb-2 rounded">
                  <span><strong>{item.name}</strong> <CopyButton text={item.name} /> (Niveau: {item.level}) - Puissance: <strong>{calculateItemPower(item)}</strong></span>
                  <ul>
                    {itemEffects.map((effect: Effect, index: number) => (
                      <li key={index}>
                        Effet {effect.effect} : {effect.from} - {effect.to} - Puissance: {calculateEffectPower(effect)}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })
          ) : (
            <p>Aucun objet trouvé pour ce niveau.</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default PowerItemsPage;
