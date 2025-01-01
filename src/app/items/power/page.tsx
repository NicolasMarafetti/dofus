/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import CopyButton from '@/app/components/CopyButton';
import NavBar from '@/app/components/NavBar';
import { Effect } from '@/app/interfaces/item';
import { calculateEffectPower, calculateItemPower } from '@/app/utils/item';
import { Item } from '@prisma/client';
import React, { useState, useEffect } from 'react';

export interface CharacteristicWeight {
  [key: string]: { name: string, power: number };
}

const DEFAULT_WEIGHTS: { [key: string]: number } = {
  'PA': 100,
  'PM': 90,
  'Portée': 51,
  '% Critique': 10,
  'Dommage': 5,
  'Arme de chasse': 5,
  'Dommage Critiques': 5,
  'Dommage Feu': 5,
  'Prospection': 3,
  'Sagesse': 3,
  'Intelligence': 1,
  'Puissance': 1
}

const PowerItemsPage: React.FC = () => {
  const [characterLevel, setCharacterLevel] = useState<string | ''>('');
  const [categories, setCategories] = useState<string[]>([]); // Liste des catégories sélectionnées
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Catégories choisies
  const [items, setItems] = useState<Item[]>([]);
  const [characteristics, setCharacteristics] = useState<string[]>([]);
  const [characteristicWeights, setCharacteristicWeights] = useState<CharacteristicWeight>({});
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /** 🚀 Récupère les objets depuis l'API */
  const fetchItemsByPower = async () => {
    if (characterLevel === '') return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/items/power?level=${characterLevel}`
      );
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des objets.');
      }

      const data: {
        items: Item[];
        characteristics: { name: string, power: number }[];
      } = await response.json();
      setItems(data.items);
      setFilteredItems(data.items);

      if (data.characteristics) {
        setCharacteristics(data.characteristics.map((char) => char.name));
        const initialWeights: CharacteristicWeight = {};
        data.characteristics.forEach((char) => {
          const weightValue = DEFAULT_WEIGHTS[char.name] ?? 0;

          initialWeights[char.name] = {
            name: char.name,
            power: weightValue,
          }
        });
        setCharacteristicWeights(initialWeights);
      }

      const categories = new Set<string>();
      data.items.forEach((item) => {
        if (item.categoryName) categories.add(item.categoryName);
      });
      setCategories(Array.from(categories));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Une erreur inconnue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  /** 🛠️ Met à jour le poids d'une caractéristique */
  const handleWeightChange = (char: string, value: number) => {
    setCharacteristicWeights((prev) => ({
      ...prev,
      [char]: {
        ...prev[char],
        power: value,
      }
    }));
  };

  /** 🔄 Recalcule les objets triés lorsqu'un poids change */
  useEffect(() => {
    if (!items.length) return;

    const sortedItems = items
      .filter((item) => {
        if (!item.categoryName) return false;
        return selectedCategories.length === 0 || selectedCategories.includes(item.categoryName)
      })
      .map((item) => ({
        ...item,
        power: calculateItemPower(item, characteristicWeights),
      }))
      .sort((a, b) => b.power - a.power); // Trie par puissance décroissante

    setFilteredItems(sortedItems);
  }, [characteristicWeights, items, selectedCategories]);

  /** 🛠️ Charge les caractéristiques initialement */
  useEffect(() => {
    if (characteristics.length === 0) {
      fetchItemsByPower();
    }
  }, []);

  /** 🛠️ Gestion du filtre des catégories */
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
    } else {
      setSelectedCategories((prev) => [...prev, category]);
    }
  };

  return (
    <>
      <NavBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Objets Triés par Puissance</h1>

        {/* 🔢 Niveau du personnage */}
        <div className="mb-4">
          <label htmlFor="level" className="block mb-2">Niveau du personnage :</label>
          <input
            type="number"
            id="level"
            value={characterLevel}
            onChange={(e) => setCharacterLevel(e.target.value === '' ? '' : e.target.value)}
            placeholder="Entrez votre niveau"
            className="border p-2 rounded w-full max-w-md"
          />
        </div>

        {/* 📂 Filtre par catégories avec checkboxes */}
        <div className="mb-4">
          <h2 className="font-bold mb-2">Filtrer par Catégories :</h2>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ⚖️ Gestion des poids */}
        <div className="mb-4">
          <h2 className="font-bold mb-2">Poids des caractéristiques :</h2>
          <div className="grid grid-cols-2 gap-2">
            {characteristics.map((char) => (
              <div key={char} className="flex items-center space-x-2">
                <label className="w-1/2">{char}</label>
                <input
                  type="number"
                  min={0}
                  value={characteristicWeights[char].power}
                  onChange={(e) => handleWeightChange(char, Number(e.target.value))}
                  className="border p-1 rounded w-1/2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 🔍 Bouton de recherche */}
        <button
          onClick={fetchItemsByPower}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading || characterLevel === ''}
        >
          {loading ? 'Chargement...' : 'Rechercher'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* 📊 Liste des objets triés */}
        <ul className="mt-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              if (!item.effects) return null;

              const itemEffects = JSON.parse(item.effects as string);

              return (
                <li key={item.id} className="border p-2 mb-2 rounded">
                  <span>
                    <strong>{item.name}</strong> <CopyButton text={item.name} />
                    (Niveau: {item.level}) - Puissance: <strong>{calculateItemPower(item, characteristicWeights)}</strong>
                  </span>
                  <ul>
                    {itemEffects.map((effect: Effect, index: number) => {
                      const effectValue =
                        effect.to !== 0 && effect.to > effect.from
                          ? `${effect.from} à ${effect.to}`
                          : Math.abs(effect.from);
                      return (
                        <li key={index}>
                          Effet {effect.effect} : {effectValue} - Puissance: {calculateEffectPower(effect, characteristicWeights)}
                        </li>
                      )
                    })}
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
