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
    const [editingItemId, setEditingItemId] = useState<string | null>(null); // Suivre quel item est en édition
    const [priceInputs, setPriceInputs] = useState<{ price1: string; price10: string; price100: string }>({
        price1: '',
        price10: '',
        price100: '',
    });

    // Filtrage des objets
    const handleFilter = useCallback(async () => {
        const filteredItemsTemp = items.filter((item) => {
            const level = item.level;
            return level >= parseInt(minLevel) && level <= parseInt(maxLevel);
        });
        setFilteredItems(filteredItemsTemp);
    }, [items, minLevel, maxLevel]);

    useEffect(() => {
        handleFilter();
    }, [handleFilter]);

    // Activer/désactiver le mode édition pour un item
    const toggleEdit = (item: Item) => {
        if (editingItemId === item.id) {
            setEditingItemId(null); // Désactiver l'édition si déjà activé
        } else {
            setEditingItemId(item.id); // Activer l'édition
            setPriceInputs({
                price1: item.price1?.toString() || '',
                price10: item.price10?.toString() || '',
                price100: item.price100?.toString() || '',
            });
        }
    };

    // Mettre à jour les champs de prix
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPriceInputs((prev) => ({ ...prev, [name]: value }));
    };

    // Valider les modifications de prix
    const savePrices = async (itemId: string) => {
        try {
            const response = await fetch(`/api/items/price`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId: itemId,
                    price1: parseFloat(priceInputs.price1),
                    price10: parseFloat(priceInputs.price10),
                    price100: parseFloat(priceInputs.price100),
                }),
            });

            if (!response.ok) {
                throw new Error('Échec de la mise à jour des prix');
            }

            // Actualiser les prix localement après modification
            setFilteredItems((prev) =>
                prev.map((item) =>
                    item.id === itemId
                        ? {
                              ...item,
                              price1: parseFloat(priceInputs.price1),
                              price10: parseFloat(priceInputs.price10),
                              price100: parseFloat(priceInputs.price100),
                          }
                        : item
                )
            );

            setEditingItemId(null); // Quitter le mode édition
        } catch (error) {
            console.error(error);
        }
    };

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
                        <li key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                                    <p>Niveau : {item.level}</p>
                                    <p>Prix unitaire : {item.price1 ?? 'N/A'} kamas</p>
                                    <p>Prix x10 : {item.price10 ?? 'N/A'} kamas</p>
                                    <p>Prix x100 : {item.price100 ?? 'N/A'} kamas</p>
                                </div>
                                <Image alt={item.name} src={item.image} height={75} width={75} />
                            </div>

                            {/* Bouton Edit */}
                            <button
                                onClick={() => toggleEdit(item)}
                                className="mt-2 text-blue-600 hover:underline"
                            >
                                {editingItemId === item.id ? 'Annuler' : 'Modifier les prix'}
                            </button>

                            {/* Champs de modification */}
                            {editingItemId === item.id && (
                                <div className="mt-4 space-y-2">
                                    <input
                                        name="price1"
                                        value={priceInputs.price1}
                                        onChange={handlePriceChange}
                                        placeholder="Prix unitaire"
                                        className="w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    <input
                                        name="price10"
                                        value={priceInputs.price10}
                                        onChange={handlePriceChange}
                                        placeholder="Prix x10"
                                        className="w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    <input
                                        name="price100"
                                        value={priceInputs.price100}
                                        onChange={handlePriceChange}
                                        placeholder="Prix x100"
                                        className="w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    <button
                                        onClick={() => savePrices(item.id)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                    >
                                        Sauvegarder
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
