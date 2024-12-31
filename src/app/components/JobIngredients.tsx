import React from 'react'
import { JobComplete } from '../interfaces/job';
import CopyButton from './CopyButton';

interface JobIngredientsProps {
    editingData: {
        [key: string]: {
            price1: number | null;
            price10: number | null;
            price100: number | null;
            sellMode: string;
            hasSalesData: boolean;
        };
    };
    handleDataChange: (id: string, field: string, value: number | string | boolean) => void;
    job: JobComplete;
    renderPriceField: (id: string, label: string, field: 'price1' | 'price10' | 'price100', value: number | null) => React.JSX.Element;
    saveItemData: (id: string) => void;
    removeIngredient: (id: string) => void; // Nouvelle prop
}

export default function JobIngredients({ editingData, handleDataChange, job, renderPriceField, saveItemData, removeIngredient }: JobIngredientsProps) {
    return (
        <ul className="list-none mt-2 ml-4">
            {job.ingredients.map((ingredient, index) => {
                return (
                    <li key={index} className="mt-2 p-2 border rounded-md">
                        <strong>{ingredient.quantity}x {ingredient.item.name}</strong>
                        <CopyButton text={ingredient.item.name} />
                        {ingredient.item.sellMode === 'single_only' && (
                            <span className="ml-2 text-yellow-500">(Vente uniquement à l&apos;unité)</span>
                        )}
                        {!ingredient.item.hasSalesData && (
                            <span className="ml-2 text-red-500">(Aucune vente enregistrée)</span>
                        )}

                        <div className="grid grid-cols-3 gap-4 mt-1">
                            {renderPriceField(ingredient.item.id, 'Prix (1x)', 'price1', ingredient.item.price1)}
                            {ingredient.item.sellMode !== 'single_only' && (
                                <>
                                    {renderPriceField(ingredient.item.id, 'Prix (10x)', 'price10', ingredient.item.price10)}
                                    {renderPriceField(ingredient.item.id, 'Prix (100x)', 'price100', ingredient.item.price100)}
                                </>
                            )}
                        </div>

                        <label className="block mt-2">
                            Mode de vente :
                            <select
                                value={editingData[ingredient.item.id]?.sellMode || ingredient.item.sellMode}
                                onChange={(e) => handleDataChange(ingredient.item.id, 'sellMode', e.target.value)}
                                className="border p-1 ml-2"
                            >
                                <option value="default">Par défaut</option>
                                <option value="single_only">Uniquement à l&apos;unité</option>
                            </select>
                        </label>

                        <div className="flex gap-4 mt-2">
                            <button
                                onClick={() => saveItemData(ingredient.item.id)}
                                className="text-green-500 underline"
                            >
                                Sauvegarder les prix
                            </button>
                            <button
                                onClick={() => removeIngredient(ingredient.id)}
                                className="text-red-500 underline"
                            >
                                Supprimer
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    )
}
