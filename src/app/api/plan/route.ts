import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { calculateCraftExp, calculateXpGained } from "@/app/utils/xpCalculator";


const prisma = new PrismaClient();

interface CraftPlan {
    craftId: string; // L'ID unique du craft
    name: string; // Le nom du craft
    level: number; // Le niveau requis pour créer le craft
    experience: number; // L'expérience obtenue pour un craft
    cost: number; // Le coût total des ressources nécessaires pour un craft
    resources: { // Les ressources nécessaires pour ce craft
        name: string; // Le nom de la ressource
        price: number; // Le prix unitaire de la ressource
        quantity: number; // La quantité requise pour une création
    }[];
}

interface GroupedCraftPlan {
    craftId: string;
    name: string;
    level: number;
    experience: number;
    cost: number;
    quantity: number; // Nombre de fois que ce craft est nécessaire
    resources: {
        name: string;
        price: number;
        quantity: number;
    }[];
}

interface GroupedResource {
    name: string; // Nom de la ressource
    price: number; // Prix unitaire
    quantity: number; // Quantité totale nécessaire
    totalCost: number; // Coût total de cette ressource
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
        const crafts = await prisma.craft.findMany({
            where: { profession },
            include: {
                resources: {
                    include: {
                        resource: true,
                    },
                },
            },
        });

        // Calculer le coût total pour chaque craft
        const craftPlans = crafts.map((craft) => {
            const cost = craft.resources.reduce((total, res) => {
                const price = res.resource?.price || 0; // Utiliser 0 comme valeur par défaut
                const quantity = res.quantity || 0;    // Utiliser 0 comme valeur par défaut
                return total + quantity * price;
            }, 0);

            return {
                craftId: craft.id,
                name: craft.name || "Craft inconnu",
                level: craft.level || 0,
                experience: calculateCraftExp(craft.level || 0),
                cost,
                resources: craft.resources.map((res) => ({
                    name: res.resource?.name || "Ressource inconnue",
                    price: res.resource?.price || 0,
                    quantity: res.quantity || 0,
                })),
            };
        });

        // Trier les crafts par coût par point d’expérience
        const sortedCrafts = craftPlans.sort((a, b) => {
            const xpA = calculateXpGained(a.experience, a.level, currentLevel); // XP ajustée pour le craft A
            const xpB = calculateXpGained(b.experience, b.level, currentLevel); // XP ajustée pour le craft B

            // Trier par coût par point d'expérience ajustée
            return (a.cost / xpA) - (b.cost / xpB);
        });

        // Calculer l’expérience totale nécessaire
        const requiredExp = calculateRequiredExp(currentLevel, targetLevel);

        // Planifier les crafts pour atteindre l’expérience totale
        const plan: CraftPlan[] = [];

        let currentExp = 0;

        for (const craft of sortedCrafts) {
            const xpPerCraft = calculateXpGained(craft.experience, craft.level, currentLevel); // Calculer l'XP ajustée

            if (xpPerCraft > 0) {
                const craftsNeeded = Math.ceil((requiredExp - currentExp) / xpPerCraft); // Nombre de crafts nécessaires

                plan.push(...Array(craftsNeeded).fill(craft)); // Ajouter plusieurs fois le craft
                currentExp += craftsNeeded * xpPerCraft;

                if (currentExp >= requiredExp) break; // Arrêter si le niveau cible est atteint
            }
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
            craft.resources.forEach((res) => {
                const existing = acc.find((r) => r.name === res.name);
                if (existing) {
                    existing.quantity += res.quantity * craft.quantity;
                    existing.totalCost += res.quantity * craft.quantity * res.price;
                } else {
                    acc.push({
                        name: res.name,
                        price: res.price,
                        quantity: res.quantity * craft.quantity,
                        totalCost: res.quantity * craft.quantity * res.price,
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
