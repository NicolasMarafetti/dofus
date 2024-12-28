'use client';

import { Item } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import RécupérationDesObjets from '../components/RécupérationDesObjets';
import ItemsList from '../components/ItemsList';

export default function ObjetPage() {
    const [minLevel, setMinLevel] = useState<string>('');
    const [maxLevel, setMaxLevel] = useState<string>('');
    const [forceUpdate, setForceUpdate] = useState<boolean>(false); // Checkbox pour forcer la récupération
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        try {
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

            <RécupérationDesObjets error={error} fetchItemsFromApi={fetchItemsFromApi} forceUpdate={forceUpdate} loading={loading} maxLevel={maxLevel} minLevel={minLevel} setForceUpdate={setForceUpdate} setMaxLevel={setMaxLevel} setMinLevel={setMinLevel} />

            <ItemsList items={items} />
        </div>
    );
}
