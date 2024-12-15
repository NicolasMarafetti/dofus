import { ResourceWithRentabilityType } from "@/app/components/ListResourcesWithRentability";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const resources = await prisma.resource.findMany({});

        const resourcesWithRentability: ResourceWithRentabilityType[] = resources.map((resource) => {
            const difficulty = typeof resource.difficultyFactor === "number" ? resource.difficultyFactor : 1;
            const profitability = resource.price * difficulty;

            return {
                ...resource,
                profitability,
            };
        });

        // Trier les ressources par rentabilité décroissante
        resourcesWithRentability.sort((a, b) => b.profitability - a.profitability);

        return NextResponse.json(resourcesWithRentability, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération des ressources rentables :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
