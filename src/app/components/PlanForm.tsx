'use client';

import { useState } from "react";
import ProfessionPicker from "./ProfessionPicker";
import PlanCrafts from "./PlanCrafts";
import { GroupedCraftPlan } from "../interfaces/plan";
import PlanWhatToBuy from "./PlanWhatToBuy";
import { GroupedResource } from "../interfaces/jobIngredient";

export interface PlanResult {
    groupedResources: GroupedResource[];
    groupedPlan: GroupedCraftPlan[];
    totalCost: number;
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

    const onSaveResourcePrice = async (itemId: string, price1: number | null, price10: number | null, price100: number | null) => {
        await fetch("/api/items/price", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId, price1, price10, price100 }),
        });
    }

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

                    <PlanWhatToBuy plan={plan} onSaveResourcePrice={onSaveResourcePrice} />

                    <PlanCrafts currentLevel={currentLevel} plan={plan} onSaveResourcePrice={onSaveResourcePrice} />
                </div>
            )}


        </div>
    );
};

export default PlanForm;
