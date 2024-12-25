import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    try {
        const { itemId, price1, price10, price100, sellMode } = await req.json();

        if (!itemId) {
            return NextResponse.json({ error: 'ID de l\'objet requis' }, { status: 400 });
        }

        // Détermine si l'objet a des ventes actives
        const hasSalesData = [price1, price10, price100].some((price) => price && price > 0);

        const updatedItem = await prisma.item.update({
            where: { id: itemId },
            data: {
                price1: price1 !== undefined ? Number(price1) : null,
                price10: price10 !== undefined ? Number(price10) : null,
                price100: price100 !== undefined ? Number(price100) : null,
                sellMode: sellMode || 'default',
                hasSalesData, // Mise à jour automatique
            },
        });

        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour des prix' }, { status: 500 });
    }
}
