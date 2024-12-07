import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Récupère toutes les ressources
 * Méthode : GET
 */
export async function GET() {
    try {
        const resources = await prisma.resource.findMany();
        return NextResponse.json(resources);
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
