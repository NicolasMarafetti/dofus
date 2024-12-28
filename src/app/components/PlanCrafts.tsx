import React, { useState } from 'react';
import { calculateXpGained } from '../utils/xpCalculator';
import { getItemMinPrice } from '../utils/item';
import { GroupedCraftPlan } from '../interfaces/plan';

interface PlanCraftsProps {
    currentLevel: number;
    plan: {
        groupedPlan: GroupedCraftPlan[];
    };
    onSaveResourcePrice: (resourceId: string, price1: number | null, price10: number | null, price100: number | null) => void;
}

export default function PlanCrafts({ currentLevel, plan, onSaveResourcePrice }: PlanCraftsProps) {
    const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
    const [price1, setPrice1] = useState<number | null>(null);
    const [price10, setPrice10] = useState<number | null>(null);
    const [price100, setPrice100] = useState<number | null>(null);

    const handleCopyResourceName = (name: string) => {
        navigator.clipboard.writeText(name);
    };

    const handleEditResource = (resourceId: string, currentPrice1: number | null, currentPrice10: number | null, currentPrice100: number | null) => {
        setEditingResourceId(resourceId);
        setPrice1(currentPrice1);
        setPrice10(currentPrice10);
        setPrice100(currentPrice100);
    };

    const handleSaveResourcePrice = (itemId: string) => {
        if (onSaveResourcePrice) {
            onSaveResourcePrice(itemId, price1, price10, price100);
        }
        setEditingResourceId(null); // Quitter le mode édition
    };

    return (
        <div>
            <h4 className="text-lg font-bold mb-2">Crafts à effectuer :</h4>
            {plan.groupedPlan.map((craft: GroupedCraftPlan, index: number) => (
                <div key={index} className="mb-4 border-b pb-4">
                    <h5 className="font-semibold">
                        {craft.name} (x{craft.quantity.toLocaleString()})
                    </h5>
                    <p>
                        <strong>Coût total :</strong> {(craft.cost * craft.quantity).toLocaleString()} kamas
                    </p>
                    <p>
                        <strong>Expérience totale :</strong>{" "}
                        {(calculateXpGained(craft.level, currentLevel) * craft.quantity).toLocaleString()}
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        {craft.ingredients.map((res, i: number) => (
                            <li key={i} className="flex justify-between items-center mt-1">
                                <span>
                                    {res.quantity * craft.quantity}x {res.item.name} (Prix unitaire : {getItemMinPrice(res.item)})
                                </span>
                                <div className="flex gap-2">
                                    {/* Bouton Copier */}
                                    <button
                                        onClick={() => handleCopyResourceName(res.item.name)}
                                        className="text-blue-500 underline hover:text-blue-700"
                                    >
                                        Copier
                                    </button>

                                    {/* Bouton Modifier */}
                                    {editingResourceId === res.id ? (
                                        <button
                                            onClick={() => handleSaveResourcePrice(res.item.id)}
                                            className="text-green-500 underline hover:text-green-700"
                                        >
                                            Sauvegarder
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEditResource(res.id, res.item.price1, res.item.price10, res.item.price100)}
                                            className="text-yellow-500 underline hover:text-yellow-700"
                                        >
                                            Modifier
                                        </button>
                                    )}
                                </div>

                                {/* Champs d'édition des prix */}
                                {editingResourceId === res.id && (
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
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
