import { createItemFromApi, getItemRecipe } from '@/app/utils/item';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const forceUpdate = searchParams.get("forceUpdate") || false;
    const minLevel = searchParams.get("minLevel") || "";
    const maxLevel = searchParams.get("maxLevel") || "";

    try {
        const allItems: { dofusdbId: number }[] = [];
        let skip = 0;
        const limit = 50; // Définissez la limite par page si nécessaire

        while (true) {
            // Appel vers l'API DofusDB avec pagination
            const response = await fetch(
                `https://api.dofusdb.fr/items?typeId[$ne]=203&$sort=-id&level[$gte]=${minLevel}&level[$lte]=${maxLevel}&lang=fr&$skip=${skip}&$limit=9999`
            );

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données depuis l\'API externe.');
            }

            const data = await response.json();

            const items: {
                id: number;
                craftVisible: boolean;
                level: number;
                name: {
                    fr: string;
                }
            }[] = data.data;

            if (items.length === 0) {
                break; // Si aucun élément n'est retourné, terminez la boucle
            }

            // Traitez les items (si nécessaire)
            for (const item of items) {
                const itemRecipe = await getItemRecipe(item.id);

                if (!itemRecipe) continue;

                allItems.push({
                    dofusdbId: item.id
                });
            }

            // Passer à la page suivante
            skip += limit;
        }

        const existingItems = await prisma.item.findMany({
            where: { dofusdbId: { in: allItems.map(item => item.dofusdbId) } },
            select: { dofusdbId: true }
        });

        const existingIds = new Set(existingItems.map(item => item.dofusdbId));

        const newItems = forceUpdate ? allItems : allItems.filter(item => !existingIds.has(item.dofusdbId));

        if (allItems.length > 0) {
            for (const item of newItems) {
                try {
                    await createItemFromApi(item.dofusdbId);
                } catch (prismaError) {
                    console.error(
                        `Erreur Prisma pour l'item ${item.dofusdbId || 'Inconnu'}`,
                        prismaError
                    );
                }
            }
        }

        return NextResponse.json(allItems, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}
