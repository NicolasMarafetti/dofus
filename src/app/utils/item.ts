/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface ItemFromApi {
    dofusdbId: number;
    level: number;
    name: string;
    job?: {
        ingredientIds: string;
        jobName: string;
        quantities: string;
    }
}

export const createItemFromApi = async (itemDofusDbId: number, saveJob: boolean = true) => {
    const itemResponse = await fetch(`https://api.dofusdb.fr/items/${itemDofusDbId}?lang=fr`);
    const itemDataResponse: {
        craftVisible: string;
        img: string;
        level: number;
        name: {
            fr: string;
        };
    } = await itemResponse.json();

    console.log("itemDataResponse: ", itemDataResponse);

    // Créez ou mettez à jour l'Item
    const createdItem = await prisma.item.upsert({
        where: { dofusdbId: itemDofusDbId },
        update: {
            level: itemDataResponse.level,
            name: itemDataResponse.name.fr
        },
        create: {
            dofusdbId: itemDofusDbId,
            image: itemDataResponse.img,
            level: itemDataResponse.level,
            name: itemDataResponse.name.fr
        },
    });

    console.log("itemDataResponse.craftVisible: ", itemDataResponse.craftVisible);

    // Si l'objet possède un Job, liez-le avec Item.id
    if (saveJob && itemDataResponse.craftVisible) {
        const response = await fetch(`https://api.dofusdb.fr/recipes/${itemDofusDbId}?lang=fr`);
        const itemApiData: {
            ingredientIds: number[];
            job: {
                name: {
                    fr: string;
                }
            },
            quantities: number[];
            result: {
                level: number;
                name: {
                    fr: string;
                };
            }
        } = await response.json();

        await prisma.job.upsert({
            where: { resultItemId: createdItem.id },
            update: {
                ingredientIds: itemApiData.ingredientIds.length > 0 ? JSON.stringify(itemApiData.ingredientIds) : undefined,
                jobName: itemApiData.job.name.fr,
                quantities: itemApiData.quantities.length > 0 ? JSON.stringify(itemApiData.quantities) : undefined
            },
            create: {
                resultItemId: createdItem.id,
                ingredientIds: JSON.stringify(itemApiData.ingredientIds),
                jobName: itemApiData.job.name.fr,
                quantities: JSON.stringify(itemApiData.quantities)
            },
        });

        // Récupération des Items des ingrédients
        const ingredientIds = itemApiData.ingredientIds;
        for (const ingredientId of ingredientIds) {
            await createItemFromApi(ingredientId, false);
        }
    }
}