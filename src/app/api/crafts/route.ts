import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ResourceInput {
    resourceId: string;
    quantity: number;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const profession = searchParams.get("profession") || "";

        const crafts = await prisma.craft.findMany({
            where: { profession },
            include: {
                resources: {
                    include: { resource: true },
                },
            },
        });

        // Ajout du coût total pour chaque craft
        const craftsWithCost = crafts.map((craft) => {
            const cost = craft.resources.reduce((total, res) => {
                return total + (res.quantity * res.resource.price);
            }, 0);

            return { ...craft, cost }; // Ajout de la propriété 'cost'
        });

        return NextResponse.json(craftsWithCost, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération des crafts :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
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

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body || !body.id) {
            return NextResponse.json(
                { error: "L'identifiant du craft est requis." },
                { status: 400 }
            );
        }

        const { id } = body;

        // Suppression du Craft et des CraftResources associées
        await prisma.$transaction([
            prisma.craftResource.deleteMany({
                where: { craftId: id },
            }),
            prisma.craft.delete({
                where: { id },
            }),
        ]);

        return NextResponse.json(
            { message: "Craft et ressources associées supprimés avec succès." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur lors de la suppression du craft :", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
