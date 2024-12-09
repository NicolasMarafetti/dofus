'use client';

import { useEffect, useState } from "react";
import ListResources from "./ListResources";

type Resource = {
    id: string;
    name: string;
    price: number;
    difficulty?: number;
    profitability?: number;
};

export default function ProfitableResources() {
    const [resources, setResources] = useState<Resource[]>([]);

    async function fetchResources() {
        try {
            const response = await fetch("/api/resources/profitable");
            if (response.ok) {
                const data: Resource[] = await response.json();
                setResources(data);
            } else {
                console.error("Erreur lors de la récupération des ressources rentables");
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    }

    useEffect(() => {
        fetchResources();
    }, []);

    const handleDifficultyChange = async (name: string, difficulty: number) => {
        try {
            const response = await fetch("/api/resources/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, difficulty }),
            });

            if (response.ok) {
                fetchResources();
            } else {
                console.error("Erreur lors de la mise à jour de la difficulté");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Ressources les plus intéressantes à farmer</h1>
            <ListResources fetchResources={fetchResources} resources={resources} onDifficultyChange={handleDifficultyChange} />
        </div>
    );
}
