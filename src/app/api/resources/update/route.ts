import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { name, difficulty } = await req.json();

        if (!name || typeof difficulty !== "number") {
            return NextResponse.json(
                { error: "Nom et difficulté sont requis." },
                { status: 400 }
            );
        }

        // Mettre à jour la difficulté dans la base de données
        const updatedResource = await prisma.resource.update({
            where: { name },
            data: { difficultyFactor: difficulty },
        });

        return NextResponse.json(updatedResource, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la difficulté :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
