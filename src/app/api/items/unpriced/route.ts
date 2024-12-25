import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const unpricedItems = await prisma.item.findMany({
            where: {
                OR: [
                    { price1: null },
                    { price10: null },
                    { price100: null },
                    { price1: 0 },
                    { price10: 0 },
                    { price100: 0 }
                ]
            },
            select: {
                id: true,
                name: true,
                level: true,
                price1: true,
                price10: true,
                price100: true
            }
        });

        console.log("unpricedItems: ", unpricedItems);

        return NextResponse.json(unpricedItems, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération des objets sans prix:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
