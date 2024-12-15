'use client';

import { Resource } from "@prisma/client";
import { useState } from "react";

interface ListResourcesProps {
    resources: Resource[];
    fetchResources: () => void;
    onDifficultyChange?: (name: string, difficulty: number) => void;
}

const ListResources = ({ fetchResources, onDifficultyChange, resources }: ListResourcesProps) => {
    const [editPrice, setEditPrice] = useState<{ [key: string]: number }>({});

    const handleUpdatePrice = async (id: string) => {
        try {
            const response = await fetch(`/api/resources`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, price: editPrice[id] }),
            });

            if (response.ok) {
                fetchResources(); // Recharge les ressources
                setEditPrice((prev) => {
                    const updated = { ...prev };
                    delete updated[id];
                    return updated;
                });
            } else {
                console.error("Erreur lors de la mise à jour du prix.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Liste des Ressources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource) => (
                    <div key={resource.id} className="border rounded p-4 shadow-sm flex flex-col">
                        {/* Titre */}
                        <h3 className="font-semibold text-lg mb-2">{resource.name}</h3>

                        {/* Prix */}
                        <div className="flex items-center justify-between mb-2">
                            {editPrice[resource.id] !== undefined ? (
                                <input
                                    type="number"
                                    value={editPrice[resource.id]}
                                    onChange={(e) =>
                                        setEditPrice((prev) => ({
                                            ...prev,
                                            [resource.id]: Number(e.target.value),
                                        }))
                                    }
                                    className="border p-1 w-20"
                                />
                            ) : (
                                <span>Prix : {resource.price} kamas</span>
                            )}
                            {editPrice[resource.id] !== undefined ? (
                                <button
                                    onClick={() => handleUpdatePrice(resource.id)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 ml-2"
                                >
                                    Sauvegarder
                                </button>
                            ) : (
                                <button
                                    onClick={() =>
                                        setEditPrice((prev) => ({
                                            ...prev,
                                            [resource.id]: resource.price,
                                        }))
                                    }
                                    className="text-blue-500 underline hover:text-blue-700 ml-2"
                                >
                                    Modifier
                                </button>
                            )}
                        </div>

                        {/* Difficulté */}
                        <div className="flex items-center justify-between mb-2">
                            <span>Difficulté : {resource.difficultyFactor || 1}</span>
                            {onDifficultyChange && (
                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        defaultValue={resource.difficultyFactor || 1}
                                        onBlur={(e) =>
                                            onDifficultyChange(resource.name, parseFloat(e.target.value))
                                        }
                                        className="border p-1 w-20"
                                    />
                                    <button
                                        onClick={(e) =>
                                            onDifficultyChange(
                                                resource.name,
                                                parseFloat(
                                                    (e.currentTarget.previousSibling as HTMLInputElement)
                                                        .value
                                                )
                                            )
                                        }
                                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 ml-2"
                                    >
                                        Mettre à jour
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Monstre et taux de drop */}
                        <div className="mb-2">
                            <span>Niveau des monstres : {resource.monsterLevel || "Non défini"}</span>
                            <input
                                type="number"
                                placeholder="Niveau"
                                defaultValue={resource.monsterLevel || ""}
                                onBlur={(e) =>
                                    onDifficultyChange &&
                                    onDifficultyChange(resource.name, parseFloat(e.target.value))
                                }
                                className="border p-1 w-20 ml-2"
                            />
                        </div>
                        <div className="mb-2">
                            <span>Taux de drop : {resource.dropRate || "Non défini"}%</span>
                            <input
                                type="number"
                                placeholder="Drop %"
                                step="0.1"
                                defaultValue={resource.dropRate || ""}
                                onBlur={(e) =>
                                    onDifficultyChange &&
                                    onDifficultyChange(resource.name, parseFloat(e.target.value))
                                }
                                className="border p-1 w-20 ml-2"
                            />
                        </div>

                        {/* Boss de donjon */}
                        <div className="flex items-center mb-2">
                            <span>Boss de Donjon : {resource.isDungeonBoss ? "Oui" : "Non"}</span>
                            <input
                                type="checkbox"
                                defaultChecked={resource.isDungeonBoss || false}
                                onChange={(e) =>
                                    onDifficultyChange &&
                                    onDifficultyChange(resource.name, e.target.checked ? 1 : 0)
                                }
                                className="ml-2"
                            />
                        </div>

                        {/* Rentabilité */}
                        <p className="mt-2 text-gray-600">
                            Rentabilité : &apos;-&apos;
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListResources;
