import React, { useState } from 'react'
import { ResourceWithRentabilityType } from './ListResourcesWithRentability';

interface ResourceWithRentabilityProps {
    getRessourcesWithRentability: () => Promise<void>;
    resource: ResourceWithRentabilityType;
}

export default function ResourceWithRentability({ getRessourcesWithRentability, resource }: ResourceWithRentabilityProps) {

    const [resourceDropRate, setResourceDropRate] = useState<number>(resource.dropRate || 0);
    const [resourceIsDungeonBoss, setResourceIsDungeonBoss] = useState<boolean>(resource.isDungeonBoss || false);
    const [resourceMonsterCount, setResourceMonsterCount] = useState<number>(resource.monsterCount || 1);
    const [resourceMonsterLevel, setResourceMonsterLevel] = useState<number>(resource.monsterLevel || 0);
    const [resourcePrice, setResourcePrice] = useState<number>(resource.price);

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedResource = {
            id: resource.id,
            dropRate: resourceDropRate,
            isDungeonBoss: resourceIsDungeonBoss,
            monsterCount: resourceMonsterCount,
            monsterLevel: resourceMonsterLevel,
            price: resourcePrice,
        };

        const response = await fetch("/api/resources", {
            method: "PATCH",
            body: JSON.stringify(updatedResource),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            alert("Erreur lors de la mise à jour de la ressource.");
        }

        getRessourcesWithRentability();
    }

    return (
        <form key={resource.id} className="border rounded p-4 shadow-sm flex flex-col" onSubmit={onFormSubmit}>
            {/* Titre */}
            <h3 className="font-semibold text-lg mb-2">{resource.name}</h3>

            {/* Prix */}
            <div className="flex items-center justify-between mb-2">
                <input
                    type="number"
                    value={resourcePrice}
                    onChange={(e) =>
                        setResourcePrice(Number(e.target.value))
                    }
                    className="border p-1 w-20"
                />
            </div>

            {/* Difficulté */}
            <div className="flex items-center justify-between mb-2">
                <span>Difficulté: {typeof resource.difficultyFactor === "number" ? resource.difficultyFactor.toFixed(2) : 1}</span>
            </div>

            {/* Monstre et taux de drop */}
            <div className="mb-2">
                <span>Quantité de monstres différent :</span>
                <input
                    type="number"
                    placeholder="Niveau"
                    onChange={(e) =>
                        setResourceMonsterCount(Number(e.target.value))
                    }
                    className="border p-1 w-20 ml-2"
                    value={resourceMonsterCount}
                />
            </div>
            <div className="mb-2">
                <span>Niveau des monstres :</span>
                <input
                    type="number"
                    placeholder="Niveau"
                    onChange={(e) =>
                        setResourceMonsterLevel(Number(e.target.value))
                    }
                    className="border p-1 w-20 ml-2"
                    value={resourceMonsterLevel}
                />
            </div>
            <div className="mb-2">
                <span>Taux de drop</span>
                <input
                    className="border p-1 w-20 ml-2"
                    onChange={(e) =>
                        setResourceDropRate(Number(e.target.value))
                    }
                    placeholder="Drop %"
                    type="number"
                    step="0.1"
                    value={resourceDropRate}
                />
            </div>

            {/* Boss de donjon */}
            <div className="flex items-center mb-2">
                <span>Boss de Donjon : </span>
                <input
                    checked={resourceIsDungeonBoss}
                    type="checkbox"
                    onChange={(e) =>
                        setResourceIsDungeonBoss(e.target.checked)
                    }
                    className="ml-2"
                />
            </div>

            {/* Rentabilité */}
            <p className="mt-2 text-gray-600">
                Rentabilité : {resource.profitability.toFixed(2)} kamas per kill
            </p>

            <input type="submit" value="Mettre à jour" className="bg-blue-500 cursor-pointer text-white px-2 py-1 rounded hover" />
        </form>
    )
}
