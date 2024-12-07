'use client';

import { useState, useEffect } from "react";
import AddResource from "../components/AddResource";
import AddCraft from "../components/AddCraft";
import ListResources from "../components/ListResources";
import NavBar from "../components/NavBat";

interface Resource {
    id: string;
    name: string;
    price: number;
}

const CraftsPage: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);

    // Fonction pour récupérer les ressources depuis l'API
    const fetchResources = async () => {
        const response = await fetch("/api/resources");
        const data = await response.json();
        setResources(data);
    };

    // Charger les ressources au montage du composant
    useEffect(() => {
        fetchResources();
    }, []);

    return (
        <div className="min-h-screen">
            <NavBar />
            <div className="bg-gray-100 p-8">
                <h1 className="text-3xl font-bold mb-4">Gestion des Crafts</h1>
                <AddResource onResourceAdded={fetchResources} />
                <ListResources resources={resources} />
                <AddCraft resources={resources} onCraftAdded={fetchResources} />
            </div>
        </div>
    );
};

export default CraftsPage;
