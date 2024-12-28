'use client'; // Assure-toi que le composant est client-side pour utiliser useState et useEffect

import { Item } from '@prisma/client';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

interface ItemsListProps {
    items: Item[];
}

export default function ItemsList({ items }: ItemsListProps) {
    const [minLevel, setMinLevel] = useState('0');
    const [maxLevel, setMaxLevel] = useState('200');
    const [filteredItems, setFilteredItems] = useState<Item[]>(items);

    const handleFilter = useCallback(async () => {
        const filteredItemsTemp = items.filter((item) => {
            const level = item.level;
            return level >= parseInt(minLevel) && level <= parseInt(maxLevel);
        });
        setFilteredItems(filteredItemsTemp);
    }, [items, minLevel, maxLevel]);

    useEffect(() => {
        handleFilter();
    }, [handleFilter])

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Liste des Objets</h1>

            {/* Filtres */}
            <div className="mb-6 flex gap-4 items-end">
                <div>
                    <label htmlFor="minLevel" className="block text-sm font-medium text-gray-700">Niveau Min</label>
                    <input
                        type="number"
                        id="minLevel"
                        value={minLevel}
                        onChange={(e) => setMinLevel(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="maxLevel" className="block text-sm font-medium text-gray-700">Niveau Max</label>
                    <input
                        type="number"
                        id="maxLevel"
                        value={maxLevel}
                        onChange={(e) => setMaxLevel(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    onClick={handleFilter}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Filtrer
                </button>
            </div>

            {/* Liste des objets */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                        <li key={item.id} className="bg-gray-50 border border-gray-200 flex items-center justify-between rounded-lg p-4 shadow hover:shadow-md transition">
                            <div>
                                <h3 className="font-medium text-gray-800">{item.name}</h3>
                                <p>Niveau : {item.level}</p>
                                {item.price1 && <p>Prix : {item.price1} kamas</p>}
                            </div>
                            <div>
                                <Image alt={item.name} src={item.image} height={75} width={75} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
