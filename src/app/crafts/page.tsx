'use client';

import { useState, useEffect, useCallback } from "react";
import NavBar from "../components/NavBar";
import ProfessionPicker from "../components/ProfessionPicker";
import JobItem from "../components/JobItem";
import { JobComplete } from "../interfaces/job";
import UnpricedItems from "../components/UnpricedItems";
import { calculateJobBenefice } from "../utils/job";

const CraftsPage: React.FC = () => {
    const [profession, setProfession] = useState<string>("");
    const [jobs, setJobs] = useState<JobComplete[]>([]);
    const [showResources, setShowResources] = useState<{ [key: string]: boolean }>({}); // Gestion des toggles

    // Récupérer les crafts pour une profession spécifique
    const fetchCrafts = useCallback(async () => {
        const urlCall = profession ? `/api/jobs?profession=${profession}` : "/api/jobs";

        const response = await fetch(urlCall);
        const data = await response.json();

        // Trier directement par bénéfice sans modifier l'objet JobComplete
        const sortedJobs = data.sort((a: JobComplete, b: JobComplete) => {
            return calculateJobBenefice(b) - calculateJobBenefice(a); // Tri décroissant
        });

        setJobs(sortedJobs);
    }, [profession]);

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
    }, [fetchCrafts]);

    return (
        <div className="min-h-screen">
            <NavBar />
            <div className="p-8 bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">Gestion des Crafts</h1>

                <ProfessionPicker setProfession={(newProfession) => setProfession(newProfession)} value={profession} />

                <UnpricedItems />

                <div>
                    <h2 className="text-2xl font-bold mb-4">Liste des Crafts</h2>
                    <ul className="list-none list-inside">
                        {jobs.map((job) => <JobItem key={job.id} job={job} onToggleResources={toggleResources} onDelete={handleDeleteCraft} fetchCrafts={fetchCrafts} showResources={showResources} />)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CraftsPage;
