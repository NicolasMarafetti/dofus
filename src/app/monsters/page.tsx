'use client';

import { useCallback, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import MonstersList from '../components/MonstersList';

interface DropItem {
    id: string;
    name: string;
    dropRate: number;
    price1?: number;
    price10?: number;
    price100?: number;
}

interface Monster {
    id: string;
    monsterDofusdbId: number;
    name: string;
    level?: number;
    isDungeonBoss: boolean;
    img?: string;
    averageGain: number;
    drops: DropItem[];
}

export default function MonstersPage() {
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [priceUpdates, setPriceUpdates] = useState<Record<string, { price1?: number; price10?: number; price100?: number }>>({});
    const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

    // États pour les filtres
    const [minLevel, setMinLevel] = useState<number | null>(null);
    const [maxLevel, setMaxLevel] = useState<number | null>(null);

    // Récupération des monstres avec filtres
    const fetchMonsters = useCallback(async () => {
        setLoading(true);

        const params = new URLSearchParams();
        if (minLevel !== null) params.append('minLevel', minLevel.toString());
        if (maxLevel !== null) params.append('maxLevel', maxLevel.toString());

        const response = await fetch(`/api/monsters?${params.toString()}`);
        const data = await response.json();
        setMonsters(data);
        setLoading(false);
    }, [minLevel, maxLevel]);

    useEffect(() => {
        fetchMonsters();
    }, [fetchMonsters]);

    // Gère la saisie des prix
    const handlePriceChange = (itemId: string, field: 'price1' | 'price10' | 'price100', value: number) => {
        setPriceUpdates((prev) => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value,
            },
        }));
    };

    // Envoie les prix mis à jour au serveur
    const handlePriceUpdate = async (itemId: string) => {
        try {
            setUpdatingItemId(itemId);

            const prices = priceUpdates[itemId] || {};

            await fetch('/api/items/price', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, ...prices }),
            });

            // Met à jour l'état local
            setMonsters((prevMonsters) =>
                prevMonsters.map((monster) => ({
                    ...monster,
                    drops: monster.drops.map((drop) =>
                        drop.id === itemId
                            ? {
                                ...drop,
                                price1: prices.price1 !== undefined ? prices.price1 : drop.price1,
                                price10: prices.price10 !== undefined ? prices.price10 : drop.price10,
                                price100: prices.price100 !== undefined ? prices.price100 : drop.price100,
                            }
                            : drop
                    ),
                }))
            );

            // Nettoie les mises à jour locales pour cet item
            setPriceUpdates((prev) => {
                const updated = { ...prev };
                delete updated[itemId];
                return updated;
            });

            fetchMonsters();

        } catch (error) {
            console.error('Erreur lors de la mise à jour des prix:', error);
        } finally {
            setUpdatingItemId(null);
        }
    };

    // Trier les monstres
    const sortedMonsters = [...monsters].sort((a, b) => {
        const aHasUnpricedDrops = a.drops.some((drop) => !drop.price1 && !drop.price10 && !drop.price100);
        const bHasUnpricedDrops = b.drops.some((drop) => !drop.price1 && !drop.price10 && !drop.price100);

        if (aHasUnpricedDrops && !bHasUnpricedDrops) return -1; // a avant b
        if (!aHasUnpricedDrops && bHasUnpricedDrops) return 1;  // b avant a

        // Sinon, trier par gain moyen décroissant
        return b.averageGain - a.averageGain;
    });

    return (
        <div className="p-4">
            <NavBar />

            <h1 className="text-2xl font-bold mb-4">Liste des Monstres</h1>

            {/* Filtres par niveau */}
            <div className="flex gap-4 mb-6">
                <div>
                    <label htmlFor="minLevel" className="block font-medium">Niveau Min</label>
                    <input
                        id="minLevel"
                        type="number"
                        value={minLevel ?? ''}
                        onChange={(e) => setMinLevel(e.target.value ? Number(e.target.value) : null)}
                        className="border rounded p-1"
                    />
                </div>
                <div>
                    <label htmlFor="maxLevel" className="block font-medium">Niveau Max</label>
                    <input
                        id="maxLevel"
                        type="number"
                        value={maxLevel ?? ''}
                        onChange={(e) => setMaxLevel(e.target.value ? Number(e.target.value) : null)}
                        className="border rounded p-1"
                    />
                </div>
                <button
                    onClick={fetchMonsters}
                    className="self-end bg-blue-500 text-white px-4 py-1 rounded"
                >
                    Filtrer
                </button>
            </div>

            <MonstersList loading={loading} sortedMonsters={sortedMonsters} handlePriceChange={handlePriceChange} handlePriceUpdate={handlePriceUpdate} updatingItemId={updatingItemId} />
        </div>
    );
}
