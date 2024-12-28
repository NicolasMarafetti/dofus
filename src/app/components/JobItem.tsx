import React, { useEffect, useState } from 'react';
import { JobComplete } from '../interfaces/job';
import JobIngredients from './JobIngredients';

interface JobItemProps {
    fetchCrafts: () => void;
    job: JobComplete;
    onToggleResources: (id: string) => void;
    onDelete: (id: string) => void;
    showResources: { [key: string]: boolean };
}

export default function JobItem({ fetchCrafts, job, onToggleResources, onDelete, showResources }: JobItemProps) {
    const [editingData, setEditingData] = useState<{
        [key: string]: {
            price1: number | null;
            price10: number | null;
            price100: number | null;
            sellMode: string;
            hasSalesData: boolean;
        };
    }>({});

    // Initialisation des valeurs par défaut
    useEffect(() => {
        const initialData: {
            [key: string]: {
                price1: number | null;
                price10: number | null;
                price100: number | null;
                sellMode: string;
                hasSalesData: boolean;
            };
        } = {};

        // Initialisation pour l'objet principal
        initialData[job.resultItem.id] = {
            price1: job.resultItem.price1 ?? null,
            price10: job.resultItem.price10 ?? null,
            price100: job.resultItem.price100 ?? null,
            sellMode: job.resultItem.sellMode ?? 'default',
            hasSalesData: job.resultItem.hasSalesData ?? false,
        };

        // Initialisation pour les ingrédients
        job.ingredients.forEach((ingredient) => {
            initialData[ingredient.item.id] = {
                price1: ingredient.item.price1 ?? null,
                price10: ingredient.item.price10 ?? null,
                price100: ingredient.item.price100 ?? null,
                sellMode: ingredient.item.sellMode ?? 'default',
                hasSalesData: ingredient.item.hasSalesData ?? false,
            };
        });

        setEditingData(initialData);
    }, [job]);

    const handleDataChange = (id: string, field: string, value: number | string | boolean) => {
        setEditingData((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const saveItemData = async (id: string) => {
        const data = editingData[id] || {};

        try {
            const response = await fetch('/api/items/price', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: id, ...data }),
            });

            fetchCrafts();

            if (!response.ok) {
                console.error('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
        }
    };

    const removeIngredient = async (id: string) => {
        try {
            const response = await fetch('/api/ingredients/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredientId: id }),
            });

            if (!response.ok) {
                console.error('Erreur lors de la suppression de l\'ingrédient');
                return;
            }

            // Actualiser les données après la suppression
            setEditingData((prev) => {
                const updatedData = { ...prev };
                delete updatedData[id];
                return updatedData;
            });

            fetchCrafts(); // Actualise la liste des crafts après suppression
        } catch (error) {
            console.error('Erreur réseau :', error);
        }
    };


    const renderPriceField = (
        id: string,
        label: string,
        field: 'price1' | 'price10' | 'price100',
        defaultValue?: number | null
    ) => (
        <div>
            <label>{label}</label>
            <input
                type="number"
                value={editingData[id]?.[field] ?? defaultValue ?? ''}
                onChange={(e) => handleDataChange(id, field, Number(e.target.value))}
                className="border p-1 w-full"
            />
        </div>
    );

    return (
        <li key={job.id} className="mb-4 p-4 border rounded-md">
            <div>
                <strong>{job.resultItem.name}</strong> (Niveau {job.resultItem.level})
                {job.resultItem.sellMode === 'single_only' && (
                    <span className="ml-2 text-yellow-500">(Vente uniquement à l&apos;unité)</span>
                )}
                {!job.resultItem.hasSalesData && (
                    <span className="ml-2 text-red-500">(Aucune vente enregistrée)</span>
                )}
                <button
                    onClick={() => onToggleResources(job.id)}
                    className="ml-4 text-blue-500 underline hover:text-blue-700"
                >
                    {showResources[job.id] ? "Masquer" : "Afficher"} les ressources
                </button>
                <button
                    onClick={() => onDelete(job.id)}
                    className="text-red-500 underline hover:text-red-700 ml-4"
                >
                    Supprimer
                </button>
            </div>

            {/* Champs de prix pour l'objet principal */}
            <div className="grid grid-cols-3 gap-4 mt-2">
                {renderPriceField(job.resultItem.id, 'Prix (1x)', 'price1', job.resultItem.price1)}
                {job.resultItem.sellMode !== 'single_only' && (
                    <>
                        {renderPriceField(job.resultItem.id, 'Prix (10x)', 'price10', job.resultItem.price10)}
                        {renderPriceField(job.resultItem.id, 'Prix (100x)', 'price100', job.resultItem.price100)}
                    </>
                )}
            </div>

            {/* Mode de vente */}
            <label className="block mt-2">
                Mode de vente :
                <select
                    value={editingData[job.resultItem.id]?.sellMode || job.resultItem.sellMode}
                    onChange={(e) => handleDataChange(job.resultItem.id, 'sellMode', e.target.value)}
                    className="border p-1 ml-2"
                >
                    <option value="default">Par défaut</option>
                    <option value="single_only">Uniquement à l&apos;unité</option>
                </select>
            </label>

            <button
                onClick={() => saveItemData(job.resultItem.id)}
                className="mt-2 text-green-500 underline"
            >
                Sauvegarder les données
            </button>

            {/* Champs pour les ingrédients */}
            {showResources[job.id] && <JobIngredients editingData={editingData} handleDataChange={handleDataChange} job={job} removeIngredient={removeIngredient} renderPriceField={renderPriceField} saveItemData={saveItemData} />}
        </li>
    );
}
