import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Récupérer toutes les ressources avec leur prix
        const resources = await prisma.resource.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                difficultyFactor: true, // Vous pouvez ajouter ce champ dans votre modèle
            },
        });

        // Calculer la rentabilité pour chaque ressource
        const profitableResources = resources.map((resource) => {
            const difficulty = typeof resource.difficultyFactor === "number" ? resource.difficultyFactor : 1;
            const profitability = resource.price * difficulty;

            return {
                id: resource.id,
                name: resource.name,
                price: resource.price,
                difficulty,
                profitability,
            };
        });

        // Trier par rentabilité décroissante
        profitableResources.sort((a, b) => b.profitability - a.profitability);

        return NextResponse.json(profitableResources, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération des ressources rentables :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
