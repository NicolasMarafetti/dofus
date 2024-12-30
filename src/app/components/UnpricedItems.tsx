import React, { useEffect, useState } from 'react';
import UnpricedItemListItem from './UnpricedItemListItem';
import { Item } from '@prisma/client';
import { CATEGORY_MAPPING } from '../constants/constants';

export default function UnpricedItems() {
    const [unpricedItems, setUnpricedItems] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [minLevel, setMinLevel] = useState<number | ''>('');
    const [maxLevel, setMaxLevel] = useState<number | ''>('');
    const [mainCategory, setMainCategory] = useState<string>(''); // Catégorie principale

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

    // Filtrer les objets selon le niveau et la catégorie principale
    useEffect(() => {
        let filtered = unpricedItems;

        if (minLevel !== '') {
            filtered = filtered.filter(item => item.level >= Number(minLevel));
        }

        if (maxLevel !== '') {
            filtered = filtered.filter(item => item.level <= Number(maxLevel));
        }

        if (mainCategory !== '') {
            const subCategories = CATEGORY_MAPPING[mainCategory] || [];
            filtered = filtered.filter(item => item.categoryName && subCategories.includes(item.categoryName));
        }

        setFilteredItems(filtered);
    }, [minLevel, maxLevel, mainCategory, unpricedItems]);

    if (unpricedItems.length === 0) return null;

    return (
        <div className="mb-8 p-4 border border-yellow-500 rounded-md bg-yellow-50">
            <h2 className="text-2xl font-bold mb-4">⚠️ Objets sans Prix Renseigné</h2>

            {/* Filtres */}
            <div className="mb-4 flex gap-4 flex-wrap">
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
                <select
                    value={mainCategory}
                    onChange={(e) => setMainCategory(e.target.value)}
                    className="p-2 border rounded-md"
                >
                    <option value="">Toutes les Catégories Principales</option>
                    <option value="Ressources">Ressources</option>
                    <option value="Consommables">Consommables</option>
                    <option value="Équipements">Équipements</option>
                </select>
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
