import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Récupérer uniquement les noms des crafts
        const crafts = await prisma.craft.findMany({
            select: {
                name: true,
            },
        });

        const craftNames = crafts.map((craft) => craft.name);
        return NextResponse.json(craftNames, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération des noms de crafts :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
