'use client';

import { useState } from "react";
import { calculateXpGained } from "../utils/xpCalculator";
import ProfessionPicker from "./ProfessionPicker";

interface PlanResult {
    groupedResources: GroupedResource[];
    groupedPlan: GroupedCraftPlan[];
    totalCost: number;
}

interface GroupedResource {
    name: string;
    price: number;
    quantity: number;
    totalCost: number;
}

interface GroupedCraftPlan {
    craftId: string;
    name: string;
    level: number;
    experience: number;
    cost: number;
    quantity: number;
    resources: {
        name: string;
        price: number;
        quantity: number;
    }[];
}


const PlanForm: React.FC = () => {
    const [profession, setProfession] = useState<string>("");
    const [currentLevel, setCurrentLevel] = useState<number>(1);
    const [targetLevel, setTargetLevel] = useState<number>(20);
    const [plan, setPlan] = useState<PlanResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("/api/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profession, currentLevel, targetLevel }),
        });
        const data = await response.json();
        setPlan(data);
    };

    return (
        <div className="p-4 border rounded bg-white shadow">
            <h2 className="text-2xl font-bold mb-4">Planification de montée en niveau</h2>
            <form onSubmit={handleSubmit}>
                <ProfessionPicker value={profession} setProfession={setProfession} />

                <label className="block mb-2 font-semibold">Niveau actuel :</label>
                <input
                    type="number"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(Number(e.target.value))}
                    className="border p-2 w-full mb-4"
                    min={1}
                    required
                />

                <label className="block mb-2 font-semibold">Niveau cible :</label>
                <input
                    type="number"
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(Number(e.target.value))}
                    className="border p-2 w-full mb-4"
                    min={currentLevel + 1}
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Générer le plan
                </button>
            </form>

            {plan && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Plan suggéré :</h3>

                    {/* Ce que vous devez acheter */}
                    <div className="mb-8">
                        <h4 className="text-lg font-bold mb-2">Ressources à acheter :</h4>
                        <ul className="list-disc list-inside">
                            {plan.groupedResources.map((res: GroupedResource, index: number) => (
                                <li key={index}>
                                    {res.quantity.toLocaleString()}x {res.name} (Prix unitaire : {res.price}) -{" "}
                                    <strong>{res.totalCost.toLocaleString()} kamas</strong>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2 text-lg font-bold">
                            Coût total des ressources : {plan.totalCost.toLocaleString()} kamas
                        </p>
                    </div>

                    {/* Les crafts à effectuer */}
                    <div>
                        <h4 className="text-lg font-bold mb-2">Crafts à effectuer :</h4>
                        {plan.groupedPlan.map((craft: GroupedCraftPlan, index: number) => (
                            <div key={index} className="mb-4 border-b pb-4">
                                <h5 className="font-semibold">
                                    {craft.name} (x{craft.quantity.toLocaleString()})
                                </h5>
                                <p>
                                    <strong>Coût total :</strong> {(craft.cost * craft.quantity).toLocaleString()}{" "}
                                    kamas
                                </p>
                                <p>
                                    <strong>Expérience totale :</strong>{" "}
                                    {(
                                        calculateXpGained(craft.level, currentLevel) *
                                        craft.quantity
                                    ).toLocaleString()}
                                </p>
                                <ul className="list-disc list-inside mt-2">
                                    {craft.resources.map((res, i: number) => (
                                        <li key={i}>
                                            {res.quantity * craft.quantity}x {res.name} (Prix unitaire : {res.price})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}


        </div>
    );
};

export default PlanForm;
