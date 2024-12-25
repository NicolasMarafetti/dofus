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

        // Fetch the crafts from the database
        const crafts = await prisma.craft.findMany({
            where: { profession },
            include: {
                resources: {
                    include: { resource: true },
                },
            },
        });

        if (!crafts || crafts.length === 0) {
            // If no crafts are found, return an empty array or an appropriate message
            return NextResponse.json([], { status: 200 });
        }

        // Add the total cost for each craft
        const craftsWithCost = crafts.map((craft) => {
            const cost = craft.resources.reduce((total, res) => {
                return total + (res.quantity * res.resource.price);
            }, 0);

            return { ...craft, cost }; // Add the 'cost' property
        });

        return NextResponse.json(craftsWithCost, { status: 200 });
    } catch (error) {
        console.error("Error while fetching crafts:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();

        // Vérification des données reçues
        const { name, level, profession, resources }: {
            name: string;
            level: number;
            profession: string;
            resources: ResourceInput[];
        } = json || {};

        if (!name || !level || !profession || !resources?.length) {
            return NextResponse.json(
                { error: "Paramètres invalides ou manquants." },
                { status: 400 }
            );
        }

        // Vérifier si un craft avec le même nom existe déjà
        const existingCraft = await prisma.craft.findUnique({
            where: { name },
        });

        if (existingCraft) {
            return NextResponse.json(
                { error: `Un craft avec le nom "${name}" existe déjà.` },
                { status: 400 }
            );
        }

        const craft = await prisma.craft.create({
            data: {
                name,
                level,
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
