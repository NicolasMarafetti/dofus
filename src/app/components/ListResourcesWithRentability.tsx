/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Resource } from "@prisma/client";
import { useEffect, useState } from "react";
import ResourceWithRentability from "./ResourceWithRentability";

export interface ResourceWithRentabilityType extends Resource {
    profitability: number;
}

const ListResourcesWithRentability = () => {
    const [resourcesWithRentability, setResourcesWithRentability] = useState<ResourceWithRentabilityType[]>([]);
    const [filteredResources, setFilteredResources] = useState<ResourceWithRentabilityType[]>([]);
    const [minLevel, setMinLevel] = useState<number | null>(null);
    const [maxLevel, setMaxLevel] = useState<number | null>(null);

    const getRessourcesWithRentability = async () => {
        const ressourcesWithRentability = await fetch("/api/resources/profitable");
        const response = await ressourcesWithRentability.json();
        setResourcesWithRentability(response);
        setFilteredResources(response); // Initialisation du filtre
    };

    const filterResources = () => {
        setFilteredResources(
            resourcesWithRentability.filter(resource => {
                const resourceMonsterLevel = typeof resource.monsterLevel === "number" ? resource.monsterLevel : 0;

                const matchesMinLevel = minLevel !== null ? resourceMonsterLevel >= minLevel : true;
                const matchesMaxLevel = maxLevel !== null ? resourceMonsterLevel <= maxLevel : true;
                return matchesMinLevel && matchesMaxLevel;
            })
        );
    };

    useEffect(() => {
        getRessourcesWithRentability();
    }, []);

    useEffect(() => {
        filterResources();
    }, [minLevel, maxLevel, resourcesWithRentability]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Liste des Ressources</h2>

            <div className="mb-4 flex gap-4">
                <div>
                    <label htmlFor="minLevel" className="block text-sm font-medium">Niveau minimum</label>
                    <input
                        id="minLevel"
                        type="number"
                        value={minLevel || ""}
                        onChange={(e) => setMinLevel(e.target.value ? parseInt(e.target.value) : null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="maxLevel" className="block text-sm font-medium">Niveau maximum</label>
                    <input
                        id="maxLevel"
                        type="number"
                        value={maxLevel || ""}
                        onChange={(e) => setMaxLevel(e.target.value ? parseInt(e.target.value) : null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource) => (
                    <ResourceWithRentability
                        key={resource.id}
                        getRessourcesWithRentability={getRessourcesWithRentability}
                        resource={resource}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListResourcesWithRentability;
