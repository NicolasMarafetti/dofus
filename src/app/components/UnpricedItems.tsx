import React, { useEffect, useState } from 'react';
import UnpricedItemListItem from './UnpricedItemListItem';

interface UnpricedItem {
    id: string;
    name: string;
    level: number;
    price1: number | null;
    price10: number | null;
    price100: number | null;
}

export default function UnpricedItems() {
    const [unpricedItems, setUnpricedItems] = useState<UnpricedItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<UnpricedItem[]>([]);
    const [minLevel, setMinLevel] = useState<number | ''>('');
    const [maxLevel, setMaxLevel] = useState<number | ''>('');

    // Récupérer les objets sans prix
    const fetchUnpricedItems = async () => {
        try {
            const response = await fetch('/api/items/unpriced');
            if (response.ok) {
                const data = await response.json();
                setUnpricedItems(data);
                setFilteredItems(data); // Initialiser le filtre avec toutes les données
            } else {
                console.error('Erreur lors de la récupération des objets sans prix');
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
        }
    };

    useEffect(() => {
        fetchUnpricedItems();
    }, []);

    // Filtrer les objets selon le niveau
    useEffect(() => {
        let filtered = unpricedItems;

        if (minLevel !== '') {
            filtered = filtered.filter(item => item.level >= Number(minLevel));
        }

        if (maxLevel !== '') {
            filtered = filtered.filter(item => item.level <= Number(maxLevel));
        }

        setFilteredItems(filtered);
    }, [minLevel, maxLevel, unpricedItems]);

    if (unpricedItems.length === 0) return null;

    return (
        <div className="mb-8 p-4 border border-yellow-500 rounded-md bg-yellow-50">
            <h2 className="text-2xl font-bold mb-4">⚠️ Objets sans Prix Renseigné</h2>

            {/* Filtres */}
            <div className="mb-4 flex gap-4">
                <input
                    type="number"
                    value={minLevel}
                    onChange={(e) => setMinLevel(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Niveau Min"
                    className="p-2 border rounded-md"
                />
                <input
                    type="number"
                    value={maxLevel}
                    onChange={(e) => setMaxLevel(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Niveau Max"
                    className="p-2 border rounded-md"
                />
            </div>

            {/* Liste des objets filtrés */}
            <ul className="list-none list-inside">
                {filteredItems.map((item) => (
                    <UnpricedItemListItem
                        key={item.id}
                        fetchUnpricedItems={fetchUnpricedItems}
                        item={item}
                    />
                ))}
            </ul>
        </div>
    );
}
