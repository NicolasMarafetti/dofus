import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const minLevel = searchParams.get("minLevel") || 1;
    const maxLevel = searchParams.get("maxLevel") || 200;

    try {
        const items = await prisma.item.findMany({
            where: {
                level: {
                    gte: Number(minLevel),
                    lte: Number(maxLevel)
                },
                Job: {
                    isNot: null
                }
            }
        });
        
        console.log("Items fetched:", items.length);

        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}
