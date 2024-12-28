import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { calculateCraftExp, calculateXpGained } from "@/app/utils/xpCalculator";
import { calculateCraftCost } from "@/app/utils/job";
import { JobComplete } from "@/app/interfaces/job";
import { GroupedCraftPlan } from "@/app/interfaces/plan";
import { GroupedResource, IngredientWithItem } from "@/app/interfaces/jobIngredient";
import { getItemMinPrice } from "@/app/utils/item";

const prisma = new PrismaClient();

interface CraftPlan {
    craftId: string;
    name: string;
    level: number;
    experience: number;
    cost: number;
    ingredients: IngredientWithItem[];
}

interface PlanResponse {
    groupedResources: GroupedResource[];
    groupedPlan: GroupedCraftPlan[];
    totalCost: number;
}

export async function POST(req: NextRequest) {
    try {
        const { profession, currentLevel, targetLevel }: {
            profession: string;
            currentLevel: number;
            targetLevel: number;
        } = await req.json();

        if (!profession || !currentLevel || !targetLevel || targetLevel <= currentLevel) {
            return NextResponse.json(
                { error: "Paramètres invalides." },
                { status: 400 }
            );
        }

        // Récupérer tous les crafts pour ce métier
        const crafts: JobComplete[] = await prisma.job.findMany({
            where: { jobName: profession },
            include: {
                resultItem: true,
                ingredients: {
                    include: {
                        item: true,
                    },
                },
            },
        });

        let dynamicLevel = currentLevel; // Niveau actuel du joueur
        const plan: CraftPlan[] = [];

        while (dynamicLevel < targetLevel) {
            // Filtrer les crafts réalisables au niveau actuel
            const availableCrafts = crafts.filter(craft => {
                return (craft.resultItem.level || 0) <= dynamicLevel
            });

            console.log("dynamicLevel", dynamicLevel);
            console.log("availableCrafts.length: ", availableCrafts.length);

            if (availableCrafts.length === 0) {
                throw new Error(`Aucun craft disponible pour le niveau ${dynamicLevel}.`);
            }

            // Trier les crafts par coût par point d'expérience gagnée (en tenant compte du niveau dynamique)
            availableCrafts.sort((a, b) => {
                const xpA = calculateXpGained(a.resultItem.level || 0, dynamicLevel);
                const xpB = calculateXpGained(b.resultItem.level || 0, dynamicLevel);

                const aCost = calculateCraftCost(a);
                const bCost = calculateCraftCost(b);

                return (aCost / xpA) - (bCost / xpB);
            });

            // Sélectionner le craft le plus rentable
            const bestCraft = availableCrafts[0];
            const xpPerCraft = calculateXpGained(bestCraft.resultItem.level || 0, dynamicLevel);

            if (xpPerCraft <= 0) {
                throw new Error(`Impossible de progresser avec les crafts disponibles.`);
            }

            // Calculer le nombre de crafts nécessaires pour passer au niveau suivant
            const xpNeeded = calculateRequiredExp(dynamicLevel, dynamicLevel + 1);
            const craftsNeeded = Math.ceil(xpNeeded / xpPerCraft);

            for (let i = 0; i < craftsNeeded; i++) {
                plan.push({
                    craftId: bestCraft.id,
                    name: bestCraft.resultItem.name || "Craft inconnu",
                    level: bestCraft.resultItem.level || 0,
                    experience: calculateCraftExp(bestCraft.resultItem.level || 0),
                    cost: calculateCraftCost(bestCraft),
                    ingredients: bestCraft.ingredients
                });
            }

            dynamicLevel += 1; // Monter d'un niveau après avoir crafté suffisamment
        }

        // Regrouper les crafts similaires
        const groupedPlan = plan.reduce<GroupedCraftPlan[]>((acc, craft) => {
            const existing = acc.find((c) => c.craftId === craft.craftId);
            if (existing) {
                existing.quantity += 1; // Ajoute à la quantité
            } else {
                acc.push({ ...craft, quantity: 1 }); // Initialise avec quantité = 1
            }
            return acc;
        }, []);

        // Regrouper les ressources nécessaires
        const groupedResources: GroupedResource[] = groupedPlan.reduce((acc, craft) => {
            craft.ingredients.forEach((res) => {
                const existing = acc.find((r) => r.item.name === res.item.name);
                if (existing) {
                    existing.quantity += res.quantity * craft.quantity;
                    existing.totalCost += res.quantity * craft.quantity * getItemMinPrice(res.item);
                } else {
                    acc.push({
                        id: res.id,
                        price: getItemMinPrice(res.item),
                        quantity: res.quantity * craft.quantity,
                        totalCost: res.quantity * craft.quantity * getItemMinPrice(res.item),
                        item: res.item
                    });
                }
            });
            return acc;
        }, [] as GroupedResource[]);


        // Coût total global
        const totalCost: number = groupedResources.reduce(
            (sum, res) => sum + res.totalCost,
            0
        );

        return NextResponse.json<PlanResponse>({ groupedResources, groupedPlan, totalCost }, { status: 200 });

    } catch (error) {
        console.error("Erreur lors du calcul du plan :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}

// Fonction pour calculer l'expérience cumulée jusqu'à un niveau donné
function calculateTotalExp(level: number): number {
    return 10 * Math.pow(level - 1, 2) + 10 * (level - 1);
}

// Fonction pour calculer l’expérience nécessaire entre deux niveaux
function calculateRequiredExp(currentLevel: number, targetLevel: number): number {
    const expAtCurrentLevel = calculateTotalExp(currentLevel);
    const expAtTargetLevel = calculateTotalExp(targetLevel);

    return expAtTargetLevel - expAtCurrentLevel;
}
