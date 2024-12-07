'use client';

import { Resource } from "@prisma/client";
import { useState } from "react";

interface AddResourceProps {
    resources: Resource[];
    onResourceAdded: () => void;
}

const AddResource: React.FC<AddResourceProps> = ({ resources, onResourceAdded }) => {
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.value;
        setName(inputName);

        // Vérifier si la ressource existe déjà
        const exists = resources.some(
            (resource) => resource.name.toLowerCase() === inputName.toLowerCase()
        );
        setIsDuplicate(exists);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isDuplicate) {
            alert("La ressource existe déjà !");
            return;
        }

        try {
            const response = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, price: parseFloat(price) }),
            });

            if (response.ok) {
                setName("");
                setPrice("");
                onResourceAdded(); // Recharge les ressources après l'ajout
            } else {
                console.error("Erreur lors de l'ajout de la ressource.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
            <label className="block mb-2 font-semibold">Nom de la ressource :</label>
            <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Exemple : Pétale Diaphane"
                className={`border p-2 w-full mb-4 ${isDuplicate ? "border-red-500" : "border-gray-300"
                    }`}
                required
            />
            {isDuplicate && (
                <p className="text-red-500 text-sm">
                    Cette ressource existe déjà !
                </p>
            )}

            <label className="block mb-2 font-semibold">Prix :</label>
            <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Exemple : 15"
                className="border p-2 w-full mb-4"
                required
            />

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Ajouter
            </button>
        </form>
    );
};

export default AddResource;
