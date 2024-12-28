import React, { useState } from 'react';
import { PlanResult } from './PlanForm';

interface PlanWhatToBuyProps {
    plan: PlanResult | null;
    onSaveResourcePrice: (itemId: string, price1: number | null, price10: number | null, price100: number | null) => void;
}

export default function PlanWhatToBuy({ plan, onSaveResourcePrice }: PlanWhatToBuyProps) {
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [price1, setPrice1] = useState<number | null>(null);
    const [price10, setPrice10] = useState<number | null>(null);
    const [price100, setPrice100] = useState<number | null>(null);

    /** Copie le nom de la ressource dans le presse-papiers */
    const handleCopyResourceName = (name: string) => {
        navigator.clipboard.writeText(name);
    };

    /** Active le mode édition */
    const handleEditResource = (itemId: string, currentPrice1: number | null, currentPrice10: number | null, currentPrice100: number | null) => {
        setEditingItemId(itemId);
        setPrice1(currentPrice1);
        setPrice10(currentPrice10);
        setPrice100(currentPrice100);
    };

    /** Sauvegarde le prix modifié */
    const handleSaveResourcePrice = (itemId: string) => {
        if (onSaveResourcePrice) {
            onSaveResourcePrice(itemId, price1, price10, price100);
        }
        setEditingItemId(null); // Quitter le mode édition
    };

    if (!plan) return;

    return (
        <div className="mb-8">
            <h4 className="text-lg font-bold mb-2">Ressources à acheter :</h4>
            <ul className="list-disc list-inside">
                {plan.groupedResources.map((res, index: number) => (
                    <li key={index} className="flex justify-between items-center mt-1">
                        <span>
                            {res.quantity.toLocaleString()}x {res.item.name} (Prix unitaire : {res.price}) -{' '}
                            <strong>{res.totalCost.toLocaleString()} kamas</strong>
                        </span>

                        {/* Boutons Copier et Modifier */}
                        <div className="flex gap-2 ml-4">
                            {/* Bouton Copier */}
                            <button
                                onClick={() => handleCopyResourceName(res.item.name)}
                                className="text-blue-500 underline hover:text-blue-700"
                            >
                                Copier
                            </button>

                            {/* Bouton Modifier ou Sauvegarder */}
                            {editingItemId === res.item.id ? (
                                <>
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        <div>
                                            <label>Prix (1x)</label>
                                            <input
                                                type="number"
                                                value={price1 ?? ''}
                                                onChange={(e) => setPrice1(Number(e.target.value) || null)}
                                                className="border p-1 rounded-md w-full"
                                            />
                                        </div>
                                        <div>
                                            <label>Prix (10x)</label>
                                            <input
                                                type="number"
                                                value={price10 ?? ''}
                                                onChange={(e) => setPrice10(Number(e.target.value) || null)}
                                                className="border p-1 rounded-md w-full"
                                            />
                                        </div>
                                        <div>
                                            <label>Prix (100x)</label>
                                            <input
                                                type="number"
                                                value={price100 ?? ''}
                                                onChange={(e) => setPrice100(Number(e.target.value) || null)}
                                                className="border p-1 rounded-md w-full"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSaveResourcePrice(res.item.id)}
                                        className="text-green-500 underline hover:text-green-700"
                                    >
                                        Sauvegarder
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleEditResource(res.item.id, res.item.price1, res.item.price10, res.item.price100)}
                                    className="text-yellow-500 underline hover:text-yellow-700"
                                >
                                    Modifier
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <p className="mt-2 text-lg font-bold">
                Coût total des ressources : {plan.totalCost.toLocaleString()} kamas
            </p>
        </div>
    );
}
