import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const profession = searchParams.get("profession") || "";

        // Fetch the crafts from the database
        const crafts = await prisma.job.findMany({
            where: { jobName: profession }
        });

        if (!crafts || crafts.length === 0) {
            // If no crafts are found, return an empty array or an appropriate message
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(crafts, { status: 200 });
    } catch (error) {
        console.error("Error while fetching crafts:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { minLevel, maxLevel } = body;

        const items = await prisma.item.findMany({
            where: {
                level: {
                    gte: Number(minLevel),
                    lte: Number(maxLevel)
                }
            }
        })

        console.log("Items found:", items);

        return NextResponse.json({ message: "Crafts updated successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error while updating crafts:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
