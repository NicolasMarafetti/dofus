import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    const items = await prisma.item.findMany();

    const unpricedItems = items.filter(item => {
        return item.price1 === null || item.price1 === undefined;
    });

    return NextResponse.json(unpricedItems, { status: 200 });
}
