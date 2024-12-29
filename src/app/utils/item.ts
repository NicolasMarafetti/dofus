/* eslint-disable @typescript-eslint/no-unused-vars */
import { Item, PrismaClient } from "@prisma/client";
import { fetchMonstersDetails } from "./monster";
import { createJobIngredients } from "./job";

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

interface ItemNotFoundResponse {
    name: 'NotFound';
    message: 'string';
    code: 404;
    className: "not-found";
}

export interface ItemResponse {
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
}

interface ItemNotFoundResponse {
    name: 'NotFound';
    message: 'string';
    code: 404;
    className: "not-found";
}

function isItemNotFoundResponse(item: ItemResponse | ItemNotFoundResponse): item is ItemNotFoundResponse {
    if ('name' in item && item.name === 'NotFound') {
        return true;
    }

    return false;
}

export const createItemFromApi = async (itemDofusDbId: number, saveJob: boolean = true) => {
    // Je vérifie si l'objet est déjà créer
    const existingItem = await prisma.item.findFirst({
        where: { dofusdbId: itemDofusDbId }
    });

    if (existingItem) {
        console.info(`🔍 L'objet ${itemDofusDbId} existe déjà.`);
        return;
    }

    const itemDataResponse = await getItemFromApi(itemDofusDbId);

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

    // Gérer les informations des monstres qui droppent cet objet
    if (itemDataResponse.dropMonsterIds?.length > 0) {
        const monstersData = await fetchMonstersDetails(itemDataResponse.dropMonsterIds);

        for (const monster of monstersData) {
            const monsterMinLevel = monster.grades.reduce((min, grade) => Math.min(min, grade.level), 999);

            const createdMonster = await prisma.monster.upsert({
                where: { monsterDofusdbId: monster.id },
                update: {
                    name: monster.name.fr,
                    level: monsterMinLevel,
                    isDungeonBoss: monster.isBoss,
                    img: monster.img
                },
                create: {
                    monsterDofusdbId: monster.id,
                    name: monster.name.fr,
                    level: monsterMinLevel,
                    isDungeonBoss: monster.isBoss,
                    img: monster.img
                }
            });

            // Ajouter les détails de drop
            for (const drop of monster.drops) {
                if (drop.objectId === itemDofusDbId) {
                    await prisma.drop.upsert({
                        where: {
                            monsterId_itemId: {
                                monsterId: createdMonster.id,
                                itemId: createdItem.id
                            }
                        },
                        update: {
                            dropRate: drop.percentDropForGrade1,
                        },
                        create: {
                            monsterId: createdMonster.id,
                            itemId: createdItem.id,
                            dropRate: drop.percentDropForGrade1,
                        }
                    });
                }
            }
        }
    }

    // Si l'objet possède un Job, liez-le avec Item.id
    if (saveJob && itemDataResponse.craftVisible) {
        const itemApiData = await getItemRecipe(itemDofusDbId);

        if (!itemApiData) {
            console.error(`Item not found with dofusdbId: ${itemDofusDbId}`);
            return;
        }

        // Enregistrement du craft
        const jobCreated = await prisma.job.upsert({
            where: { resultItemId: createdItem.id },
            update: {
                jobName: itemApiData.job.name.fr
            },
            create: {
                resultItemId: createdItem.id,
                jobName: itemApiData.job.name.fr
            },
        });

        // Création des objets ingrédients
        await createJobIngredients(jobCreated.id, itemApiData);
    }
}

export const deleteItemAndAllRelatedData = async (itemId: string) => {
    console.info(`🔄 Début de la suppression de l'objet ${itemId} et de ses relations.`);

    // Étape 1 : Supprimer les JobIngredient liés à l'Item
    await prisma.jobIngredient.deleteMany({
        where: {
            itemId: itemId,
        },
    });
    console.info(`✅ Relations JobIngredient supprimées.`);

    // Étape 2 : Trouver les Jobs associés à l'Item
    const jobs = await prisma.job.findMany({
        where: {
            resultItemId: itemId,
        },
        select: { id: true },
    });

    // Étape 3 : Supprimer les JobIngredient liés aux Jobs
    const jobIds = jobs.map((job) => job.id);
    if (jobIds.length > 0) {
        await prisma.jobIngredient.deleteMany({
            where: {
                jobId: { in: jobIds },
            },
        });
        console.info(`✅ Ingrédients des Jobs associés supprimés.`);
    }

    // Étape 4 : Supprimer les Jobs associés
    await prisma.job.deleteMany({
        where: {
            id: { in: jobIds },
        },
    });
    console.info(`✅ Relations Job supprimées.`);

    // Étape 5 : Supprimer les relations Drop associées
    await prisma.drop.deleteMany({
        where: {
            itemId: itemId,
        },
    });
    console.info(`✅ Relations Drop supprimées.`);

    // Étape 6 : Supprimer l'Item lui-même
    await prisma.item.delete({
        where: {
            id: itemId,
        },
    });
    console.info(`✅ Objet Item supprimé.`);

    console.info(`🎯 Suppression complète de l'objet ${itemId} et de ses relations terminée.`);
};

export const getItemFromApi = async (itemDofusDbId: number) => {
    const itemResponse = await fetch(`https://api.dofusdb.fr/items/${itemDofusDbId}?lang=fr`);
    const itemDataResponse: {
        craftVisible: string;
        dropMonsterIds: number[];
        hasRecipe: boolean;
        img: string;
        level: number;
        name: {
            fr: string;
        };
    } = await itemResponse.json();

    return itemDataResponse;
}

export const getItemMinPrice = (item: Item) => {
    const price1 = item.price1 && item.price1 > 0 ? item.price1 : null;
    const price10 = item.price10 && item.price10 > 0 ? item.price10 / 10 : null;
    const price100 = item.price100 && item.price100 > 0 ? item.price100 / 100 : null;

    if (price1 === null && price10 === null && price100 === null) return 1;

    return Math.min(price1 ?? Infinity, price10 ?? Infinity, price100 ?? Infinity);
}

export const getItemRecipe = async (itemId: number) => {
    const response = await fetch(`https://api.dofusdb.fr/recipes/${itemId}?lang=fr`);
    const itemApiData: ItemResponse | ItemNotFoundResponse = await response.json();

    if (isItemNotFoundResponse(itemApiData)) return null;

    return itemApiData;
}
