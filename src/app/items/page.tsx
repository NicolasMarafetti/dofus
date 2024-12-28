'use client';

import { Item } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Image from 'next/image';

export default function ObjetPage() {
    const [minLevel, setMinLevel] = useState<string>('');
    const [maxLevel, setMaxLevel] = useState<string>('');
    const [forceUpdate, setForceUpdate] = useState<boolean>(false); // Checkbox pour forcer la récupération
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        try {
            console.log("Je vais fetch");

            const response = await fetch(`/api/items?minLevel=${minLevel || 1}&maxLevel=${maxLevel || 200}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur inconnue');
            }
            const data = await response.json();
            setItems(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message); // Erreur typée
            } else {
                setError('Une erreur inconnue est survenue'); // Cas imprévu
            }
        } finally {
            setLoading(false);
        }
    }, [minLevel, maxLevel]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const fetchItemsFromApi = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/items/getFromApi?minLevel=${minLevel || 0}&maxLevel=${maxLevel || 200}&forceUpdate=${forceUpdate}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur inconnue');
            }

            fetchItems();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message); // Erreur typée
            } else {
                setError('Une erreur inconnue est survenue'); // Cas imprévu
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto min-h-screen bg-gray-100">
            <NavBar />

            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={fetchItemsFromApi} className="space-y-4 p-6 bg-white shadow-md rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Niveau Minimum :</label>
                            <input
                                type="number"
                                value={minLevel}
                                onChange={(e) => setMinLevel(e.target.value)}
                                placeholder="Ex : 1"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Niveau Maximum :</label>
                            <input
                                type="number"
                                value={maxLevel}
                                onChange={(e) => setMaxLevel(e.target.value)}
                                placeholder="Ex : 200"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="forceUpdate"
                            checked={forceUpdate}
                            onChange={(e) => setForceUpdate(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                            value={forceUpdate ? 'true' : 'false'}
                        />
                        <label htmlFor="forceUpdate" className="text-sm text-gray-700">
                            Forcer la récupération même si les objets existent déjà
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : 'Récupérer les objets'}
                    </button>
                </form>

                {loading && <p className="text-center text-blue-500 mt-4">Chargement...</p>}
                {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Liste des Objets</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map((item) => (
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
