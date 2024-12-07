'use client';

import { useState } from "react";

interface AddResourceProps {
    onResourceAdded: () => void;
}

const AddResource: React.FC<AddResourceProps> = ({ onResourceAdded }) => {
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, price: parseFloat(price) }),
            });

            if (response.ok) {
                setName("");
                setPrice("");
                onResourceAdded(); // Informer le parent que la ressource a été ajoutée
            } else {
                console.error("Erreur lors de l'ajout de la ressource.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de la ressource"
                className="border p-2 mr-2"
                required
            />
            <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Prix"
                className="border p-2 mr-2"
                required
            />
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Ajouter
            </button>
        </form>
    );
};

export default AddResource;
