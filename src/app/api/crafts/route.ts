import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ResourceInput {
    resourceId: string;
    quantity: number;
}

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();

        // Vérification des données reçues
        const { name, level, experience, profession, resources }: {
            name: string;
            level: number;
            experience: number;
            profession: string;
            resources: ResourceInput[];
        } = json || {};

        if (!name || !level || !experience || !profession || !resources?.length) {
            return NextResponse.json(
                { error: "Paramètres invalides ou manquants." },
                { status: 400 }
            );
        }

        const craft = await prisma.craft.create({
            data: {
                name,
                level,
                experience,
                profession,
                resources: {
                    create: resources.map((res) => ({
                        quantity: res.quantity,
                        resource: { connect: { id: res.resourceId } },
                    })),
                },
            },
        });

        return NextResponse.json(craft, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de l'ajout du craft :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
