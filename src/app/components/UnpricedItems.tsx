import React, { useEffect, useState } from 'react'

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

    // Récupérer les objets sans prix
    const fetchUnpricedItems = async () => {
        try {
            const response = await fetch('/api/items/unpriced');
            if (response.ok) {
                const data = await response.json();
                setUnpricedItems(data);
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

    console.log("unpricedItems: ", unpricedItems);

    if (unpricedItems.length === 0) return null;

    return (
        <div className="mb-8 p-4 border border-yellow-500 rounded-md bg-yellow-50">
            <h2 className="text-2xl font-bold mb-2">⚠️ Objets sans Prix Renseigné</h2>
            <ul className="list-none list-inside">
                {unpricedItems.map((item) => (
                    <li key={item.id} className="mb-2">
                        <strong>{item.name}</strong> (Niveau {item.level})
                        <div className="grid grid-cols-3 gap-4 mt-2">
                            <div>
                                <label>Prix (1x)</label>
                                <input
                                    type="number"
                                    defaultValue={item.price1 ?? ''}
                                    onBlur={(e) => {
                                        fetch('/api/items/price', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ itemId: item.id, price1: Number(e.target.value) })
                                        });
                                    }}
                                    className="border p-1 w-full"
                                />
                            </div>
                            <div>
                                <label>Prix (10x)</label>
                                <input
                                    type="number"
                                    defaultValue={item.price10 ?? ''}
                                    onBlur={(e) => {
                                        fetch('/api/items/price', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ itemId: item.id, price10: Number(e.target.value) })
                                        });
                                    }}
                                    className="border p-1 w-full"
                                />
                            </div>
                            <div>
                                <label>Prix (100x)</label>
                                <input
                                    type="number"
                                    defaultValue={item.price100 ?? ''}
                                    onBlur={(e) => {
                                        fetch('/api/items/price', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ itemId: item.id, price100: Number(e.target.value) })
                                        });
                                    }}
                                    className="border p-1 w-full"
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
