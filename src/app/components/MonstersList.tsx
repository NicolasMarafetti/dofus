import { Monster } from '@prisma/client';
import Image from 'next/image';
import React, { useState } from 'react'

interface DropItem {
    id: string;
    name: string;
    dropRate: number;
    price1?: number;
    price10?: number;
    price100?: number;
}

export interface MonsterWithGain extends Monster {
    averageGain: number;
    drops: DropItem[];
}

interface MonstersListProps {
    handlePriceChange: (itemId: string, field: 'price1' | 'price10' | 'price100', value: number) => void;
    handlePriceUpdate: (id: string) => void;
    loading: boolean;
    sortedMonsters: MonsterWithGain[];
    updatingItemId: string | null;
}

export default function MonstersList({ handlePriceChange, handlePriceUpdate, loading, sortedMonsters, updatingItemId }: MonstersListProps) {
    const [copiedDropId, setCopiedDropId] = useState<string | null>(null);

    const copyDropName = async (dropId: string, name: string) => {
        try {
            await navigator.clipboard.writeText(name);
            setCopiedDropId(dropId);

            setTimeout(() => {
                setCopiedDropId(null);
            }, 2000); // Réinitialise après 2 secondes
        } catch (error) {
            console.error('Erreur lors de la copie du nom de l\'objet :', error);
        }
    };

    if (loading) return <p>Chargement des monstres...</p>;

    return (
        <>
            {sortedMonsters.map((monster) => (
                <div key={monster.id} className="mb-6 border p-4 rounded-md">
                    <h2 className="text-xl font-bold">
                        {monster.name} ({monster.level || 'N/A'})
                    </h2>
                    <p>Boss : {monster.isDungeonBoss ? 'Oui' : 'Non'}</p>
                    <p>Mini Boss : {monster.isMiniBoss ? 'Oui' : 'Non'}</p>
                    <p>Gain Moyen : {monster.averageGain.toFixed(2)} Kamas</p>
                    <div className="my-2">
                        <Image
                            src={monster.img || '/placeholder.png'}
                            alt={monster.name}
                            width={100}
                            height={100}
                            className="rounded-md"
                        />
                    </div>

                    <h3 className="text-lg mt-4 font-bold">Objets Droppés :</h3>
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                        <thead>
                            <tr>
                                <th className="border p-2">Nom</th>
                                <th className="border p-2">Taux de Drop</th>
                                <th className="border p-2">Prix (1)</th>
                                <th className="border p-2">Prix (10)</th>
                                <th className="border p-2">Prix (100)</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monster.drops.map((drop) => (
                                <tr key={drop.id}>
                                    <td className="border p-2">
                                        <span className="mr-2"> {drop.name}</span>
                                        <button
                                            onClick={() => copyDropName(drop.id, drop.name)}
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                        >
                                            {copiedDropId === drop.id ? 'Copié !' : '📋'}
                                        </button>
                                    </td>
                                    <td className="border p-2">{drop.dropRate}%</td>
                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            defaultValue={drop.price1 || 0}
                                            onChange={(e) =>
                                                handlePriceChange(drop.id, 'price1', Number(e.target.value))
                                            }
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            defaultValue={drop.price10 || 0}
                                            onChange={(e) =>
                                                handlePriceChange(drop.id, 'price10', Number(e.target.value))
                                            }
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            defaultValue={drop.price100 || 0}
                                            onChange={(e) =>
                                                handlePriceChange(drop.id, 'price100', Number(e.target.value))
                                            }
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            className={`px-2 py-1 rounded ${updatingItemId === drop.id
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-500 text-white'
                                                }`}
                                            onClick={() => handlePriceUpdate(drop.id)}
                                            disabled={updatingItemId === drop.id}
                                        >
                                            {updatingItemId === drop.id ? 'Mise à jour...' : 'Mettre à jour'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </>
    )
}
