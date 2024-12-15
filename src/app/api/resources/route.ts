import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Récupère toutes les ressources
 * Méthode : GET
 */
export async function GET() {
    try {
        const resources = await prisma.resource.findMany({
            orderBy: {
                name: 'asc', // Trie les ressources par ordre alphabétique
            },
        });

        return NextResponse.json(resources, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération des ressources :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}

/**
 * Ajoute une nouvelle ressource
 * Méthode : POST
 */
export async function POST(req: NextRequest) {
    try {
        const { name, price } = await req.json();

        // Validation des données
        if (!name || price === undefined || typeof price !== "number") {
            return NextResponse.json(
                { error: "Paramètres invalides : 'name' ou 'price' manquant ou incorrect." },
                { status: 400 }
            );
        }

        const resource = await prisma.resource.create({
            data: { name, price },
        });

        return NextResponse.json(resource, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de l'ajout de la ressource :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { id, dropRate, isDungeonBoss, monsterCount, monsterLevel, price }: {
            id: string;
            dropRate: number;
            isDungeonBoss: boolean;
            monsterCount: number;
            monsterLevel: number;
            price: number;
        } = await req.json();

        if (!id || dropRate === undefined || isDungeonBoss === undefined || monsterLevel === undefined || price === undefined) {
            return NextResponse.json(
                { error: "Paramètres invalides." },
                { status: 400 }
            );
        }

        let resourceDifficultyFactor = dropRate / 100;
        if (isDungeonBoss) resourceDifficultyFactor /= 5;
        if (monsterCount) resourceDifficultyFactor /= monsterCount;

        const updatedResource = await prisma.resource.update({
            where: { id },
            data: {
                dropRate,
                isDungeonBoss,
                monsterCount,
                monsterLevel,
                price,
                difficultyFactor: resourceDifficultyFactor,
            },
        });

        return NextResponse.json(updatedResource, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du prix :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
