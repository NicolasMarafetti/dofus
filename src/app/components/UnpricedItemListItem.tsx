import React, { useState } from 'react';

interface UnpricedItemProps {
    item: {
        id: string;
        name: string;
        level: number;
        price1: number | null;
        price10: number | null;
        price100: number | null;
    },
    updateItemPrices: (itemId: string, price1: number | null, price10: number | null, price100: number | null) => Promise<void>;
}

export default function UnpricedItemListItem({ item, updateItemPrices }: UnpricedItemProps) {
    const [prices, setPrices] = useState({
        price1: item.price1 ?? '',
        price10: item.price10 ?? '',
        price100: item.price100 ?? ''
    });
    const [isSaving, setIsSaving] = useState(false); // État pour afficher un état de sauvegarde
    const [isCopied, setIsCopied] = useState(false); // État pour indiquer la copie

    // Met à jour l'état local lorsqu'une valeur change
    const handlePriceChange = (key: keyof typeof prices, value: string) => {
        setPrices((prev) => ({ ...prev, [key]: value }));
    };

    // Envoie les prix mis à jour lorsque le bouton est cliqué
    const handleSave = async () => {
        setIsSaving(true); // Active l'état de sauvegarde
        try {
            await updateItemPrices(item.id, Number(prices.price1) || null, Number(prices.price10) || null, Number(prices.price100) || null);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des prix :', error);
        } finally {
            setIsSaving(false); // Désactive l'état de sauvegarde
        }
    };

    // Copie le nom de l'objet dans le presse-papier
    const handleCopyName = async () => {
        try {
            await navigator.clipboard.writeText(item.name);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Réinitialise après 2 secondes
        } catch (error) {
            console.error('Erreur lors de la copie du nom :', error);
        }
    };

    return (
        <li className="mb-4 border p-4 rounded-md">
            <div className="flex items-center">
                <span><strong>{item.name}</strong> (Niveau {item.level})</span>
                <button
                    onClick={handleCopyName}
                    className="ml-4 px-2 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
                >
                    {isCopied ? 'Copié !' : 'Copier le nom'}
                </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                    <label>Prix (1x)</label>
                    <input
                        type="number"
                        value={prices.price1}
                        onChange={(e) => handlePriceChange('price1', e.target.value)}
                        className="border p-1 w-full"
                    />
                </div>
                <div>
                    <label>Prix (10x)</label>
                    <input
                        type="number"
                        value={prices.price10}
                        onChange={(e) => handlePriceChange('price10', e.target.value)}
                        className="border p-1 w-full"
                    />
                </div>
                <div>
                    <label>Prix (100x)</label>
                    <input
                        type="number"
                        value={prices.price100}
                        onChange={(e) => handlePriceChange('price100', e.target.value)}
                        className="border p-1 w-full"
                    />
                </div>
            </div>
            <div className="mt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`px-4 py-2 rounded ${isSaving ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                >
                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </li>
    );
}
