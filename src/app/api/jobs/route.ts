import { NextRequest, NextResponse } from "next/server";
import { Job, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const profession = searchParams.get("profession") || "";

        let jobs: Job[];

        if (profession) {
            jobs = await prisma.job.findMany({
                where: { jobName: profession },
                include: {
                    resultItem: true,
                    ingredients: {
                        include: {
                            item: true
                        }
                    }
                }
            });
        } else {
            jobs = await prisma.job.findMany({
                include: {
                    resultItem: true,
                    ingredients: {
                        include: {
                            item: true
                        }
                    }
                }
            });
        }

        if (!jobs || jobs.length === 0) {
            // If no crafts are found, return an empty array or an appropriate message
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(jobs, { status: 200 });
    } catch (error) {
        console.error("Error while fetching crafts:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
