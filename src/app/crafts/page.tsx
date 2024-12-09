'use client';

import { useState, useEffect, useCallback } from "react";
import AddCraft from "../components/AddCraft";
import NavBar from "../components/NavBar";
import { PROFESSIONS } from "../constants/constants";
import AddResource from "../components/AddResource";
import ListResources from "../components/ListResources";
import { Resource } from "@prisma/client";

interface Craft {
    id: string; // Identifiant unique du craft
    name: string; // Nom du craft
    level: number; // Niveau requis pour le craft
    experience: number; // Expérience gagnée en réalisant le craft
    profession: string; // Profession associée au craft
    cost: number; // Coût total du craft (calculé dans l'API)
    resources: {
        quantity: number; // Quantité requise pour la ressource
        resource: {
            name: string; // Nom de la ressource
            price: number; // Prix unitaire de la ressource
        };
    }[];
}

const CraftsPage: React.FC = () => {
    const [profession, setProfession] = useState<string>("Cordonnier");
    const [crafts, setCrafts] = useState<Craft[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [showResources, setShowResources] = useState<{ [key: string]: boolean }>({}); // Gestion des toggles

    // Récupérer les crafts pour une profession spécifique
    const fetchCrafts = useCallback(async () => {
        const response = await fetch(`/api/crafts?profession=${profession}`);
        const data = await response.json();
        setCrafts(data);
    }, [profession]);

    // Fonction pour récupérer les ressources depuis l'API
    const fetchResources = async () => {
        const response = await fetch("/api/resources");
        const data = await response.json();
        setResources(data);
    };

    const handleDeleteCraft = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce craft ?")) return;

        try {
            const response = await fetch(`/api/crafts`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                alert("Craft supprimé avec succès.");
                fetchCrafts(); // Rechargez la liste des crafts
            } else {
                console.error("Erreur lors de la suppression du craft.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    };


    const toggleResources = (id: string) => {
        setShowResources((prev) => ({
            ...prev,
            [id]: !prev[id], // Inverse l'état du toggle pour ce craft
        }));
    };

    useEffect(() => {
        fetchCrafts();
        fetchResources();
    }, [fetchCrafts]);

    return (
        <div className="min-h-screen">
            <NavBar />
            <div className="p-8 bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">Gestion des Crafts</h1>
                <AddResource onResourceAdded={fetchResources} resources={resources} />
                <ListResources fetchResources={fetchResources} resources={resources} />

                <div className="mb-8">
                    <label className="block mb-2 font-semibold">Choisissez une profession :</label>
                    <select
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className="border p-2 w-full mb-4"
                    >
                        {PROFESSIONS.map((prof) => (
                            <option key={prof} value={prof}>
                                {prof}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Liste des Crafts</h2>
                    <ul className="list-none list-inside">
                        {crafts.map((craft) => (
                            <li key={craft.id} className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <strong>{craft.name}</strong> (Niveau {craft.level}) - Expérience : {craft.experience} - Coût total : {craft.cost} kamas
                                        <button
                                            onClick={() => toggleResources(craft.id)}
                                            className="ml-4 text-blue-500 underline hover:text-blue-700"
                                        >
                                            {showResources[craft.id] ? "Masquer" : "Afficher"} les ressources
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCraft(craft.id)}
                                        className="text-red-500 underline hover:text-red-700 ml-4"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                                {showResources[craft.id] && (
                                    <ul className="list-none mt-2 ml-4">
                                        {craft.resources.map((res, index) => (
                                            <li key={index}>
                                                {res.quantity}x {res.resource.name} (Prix unitaire : {res.resource.price})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>

                </div>

                <div className="mt-8">
                    <AddCraft profession={profession} resources={resources} onCraftAdded={fetchCrafts} />
                </div>
            </div>
        </div>
    );
};

export default CraftsPage;
