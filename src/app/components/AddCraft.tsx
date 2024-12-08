'use client';

import { useEffect, useState } from "react";

interface Resource {
    id: string;
    name: string;
}

interface AddCraftProps {
    profession: string;
    resources: Resource[];
    onCraftAdded: () => void;
}

const AddCraft: React.FC<AddCraftProps> = ({ profession, resources, onCraftAdded }) => {
    const [craftNames, setCraftNames] = useState<string[]>([]);
    const [name, setName] = useState<string>("");
    const [level, setLevel] = useState<number>(0);
    const [selectedResources, setSelectedResources] = useState<
        { resourceId: string; quantity: number }[]
    >([]);
    const [error, setError] = useState<string | null>(null);

    // Charger les noms existants au montage du composant
    useEffect(() => {
        async function fetchCraftNames() {
            try {
                const response = await fetch("/api/crafts/names"); // Endpoint qui retourne les noms
                if (response.ok) {
                    const names = await response.json();
                    setCraftNames(names);
                } else {
                    console.error("Erreur lors du chargement des noms de crafts");
                }
            } catch (error) {
                console.error("Erreur :", error);
            }
        }

        fetchCraftNames();
    }, []);

    const handleAddResource = () => {
        setSelectedResources([
            ...selectedResources,
            { resourceId: "", quantity: 1 },
        ]);
    };

    // Vérifier si le nom existe déjà lors de la saisie
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setName(name);

        if (craftNames.includes(name)) {
            setError(`Le craft "${name}" existe déjà.`);
        } else {
            setError(null);
        }
    };

    const handleResourceChange = (index: number, key: string, value: string | number) => {
        setSelectedResources((prev) =>
            prev.map((res, i) =>
                i === index ? { ...res, [key]: value } : res
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name,
            level,
            profession,
            resources: selectedResources,
        };

        try {
            const response = await fetch("/api/crafts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setName("");
                setLevel(0);
                setSelectedResources([]);
                onCraftAdded(); // Recharger les crafts après l'ajout
            } else {
                console.error("Erreur lors de l'ajout du craft.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow">
            <h2 className="text-2xl font-bold mb-4">Ajouter un Craft</h2>

            <label className="block mb-2 font-semibold">Nom du Craft :</label>
            <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Exemple : Bouclier de Bouftou"
                className="border p-2 w-full mb-4"
                required
            />
            {error && <p style={{ color: "red" }}>{error}</p>}

            <p className="text-gray-700 mb-4">
                <strong>Métier sélectionné :</strong> {profession}
            </p>

            <label className="block mb-2 font-semibold">Niveau requis :</label>
            <input
                type="number"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                placeholder="Exemple : 20"
                className="border p-2 w-full mb-4"
                required
            />

            <h3 className="font-semibold mb-2">Ressources nécessaires :</h3>
            {selectedResources.map((res, index) => (
                <div key={index} className="flex items-center mb-2">
                    <select
                        value={res.resourceId}
                        onChange={(e) =>
                            handleResourceChange(index, "resourceId", e.target.value)
                        }
                        className="border p-2 mr-2 w-1/2"
                        required
                    >
                        <option value="">Sélectionnez une ressource</option>
                        {resources.map((resource) => (
                            <option key={resource.id} value={resource.id}>
                                {resource.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={res.quantity}
                        onChange={(e) =>
                            handleResourceChange(index, "quantity", Number(e.target.value))
                        }
                        placeholder="Quantité"
                        className="border p-2 w-1/2"
                        required
                    />
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddResource}
                className="bg-green-500 text-white px-4 py-2 rounded mb-2"
            >
                Ajouter une ressource
            </button>

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Ajouter le Craft
            </button>
        </form>
    );
};

export default AddCraft;
