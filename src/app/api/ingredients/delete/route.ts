import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
    try {
        const { ingredientId } = await request.json();

        if (!ingredientId) {
            return NextResponse.json({ error: 'ID d\'ingrédient manquant' }, { status: 400 });
        }

        await prisma.jobIngredient.delete({
            where: { id: ingredientId },
        });

        return NextResponse.json({ message: 'Ingrédient supprimé avec succès' }, { status: 200 });
    } catch (error) {
        console.error('Erreur API :', error);
        return NextResponse.json({ error: 'Erreur lors de la suppression de l\'ingrédient' }, { status: 500 });
    }
}
