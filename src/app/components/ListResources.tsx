'use client';

import { useState } from "react";

interface Resource {
    id: string;
    name: string;
    price: number;
}

interface ListResourcesProps {
    resources: Resource[];
    fetchResources: () => void;
}

const ListResources = ({ resources, fetchResources }: ListResourcesProps) => {
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
                    delete updated[id]; // Supprime la clé au lieu d'assigner undefined
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
                        <h3 className="font-semibold text-lg">{resource.name}</h3>
                        <div className="flex items-center justify-between mt-2">
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
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
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
                                    className="text-blue-500 underline hover:text-blue-700"
                                >
                                    Modifier
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListResources;
