import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const minParam = searchParams.get("minLevel");
        const maxParam = searchParams.get("maxLevel");
        const minLevel = minParam ? parseInt(minParam) : 0;
        const maxLevel = maxParam ? parseInt(maxParam) : 200;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: any = await prisma.$runCommandRaw({
            aggregate: 'Item',
            pipeline: [
                {
                    $match: {
                        level: { $gte: minLevel, $lte: maxLevel },
                        $or: [
                            { price1: { $exists: false } },
                            { price1: null }
                        ]
                    }
                }
            ],
            cursor: {}
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unpricedItems = items.cursor.firstBatch.map((item: any) => ({
            id: item._id?.$oid || item.id,
            name: item.name,
            level: item.level,
            price1: item.price1,
            price10: item.price10,
            price100: item.price100
        }));

        return NextResponse.json(unpricedItems, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération des objets sans prix:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
