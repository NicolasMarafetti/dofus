import { createItemFromApi, getItemFromApi, getItemMinPrice, getItemRecipe, getItemsWithRecipeFromApi, ItemRecipesResponse } from "./item";
import { JobComplete } from "../interfaces/job";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const calculateCraftCost = (job: JobComplete) => {
    let craftCost = 0;

    for (const ingredient of job.ingredients) {
        const itemMinPrice = getItemMinPrice(ingredient.item);

        craftCost += itemMinPrice * ingredient.quantity;
    }

    return craftCost;
}

export const calculateJobBenefice = (job: JobComplete) => {
    const craftCost = calculateCraftCost(job);
    const itemMinPrice = getItemMinPrice(job.resultItem);

    return itemMinPrice - craftCost;
}

/**
 * Crée les ingrédients pour un métier, en vérifiant qu'ils n'existent pas déjà.
 */
export const createJobIngredients = async (jobId: string, recipeData: ItemRecipesResponse) => {
    try {
        console.info(`🛠️ Début de la création des ingrédients pour le métier ${jobId}`);

        // Étape 1 : Créer ou vérifier l'existence des objets ingrédients
        for (const ingredientId of recipeData.ingredientIds) {
            const existingItem = await prisma.item.findFirst({
                where: { dofusdbId: ingredientId }
            });

            if (!existingItem) {
                console.info(`📦 L'objet avec dofusdbId ${ingredientId} n'existe pas. Création en cours...`);
                await createItemFromApi(ingredientId, false);
            } else {
                console.info(`✅ L'objet avec dofusdbId ${ingredientId} existe déjà.`);
            }
        }

        // Étape 2 : Enregistrer les composants du craft
        for (const key in recipeData.ingredientIds) {
            const ingredientId = recipeData.ingredientIds[key];
            const ingredientQuantity = recipeData.quantities[key];

            // Recherche de l'objet (après potentielle création)
            const item = await prisma.item.findFirst({
                where: { dofusdbId: ingredientId }
            });

            if (!item) {
                console.error(`❌ Erreur : Impossible de trouver l'objet avec dofusdbId ${ingredientId} après vérification.`);
                continue;
            }

            // Vérifier si l'ingrédient du métier existe déjà
            const existingIngredient = await prisma.jobIngredient.findFirst({
                where: {
                    jobId: jobId,
                    itemId: item.id,
                }
            });

            if (existingIngredient) {
                console.warn(`⚠️ L'ingrédient avec itemId ${item.id} et jobId ${jobId} existe déjà. Skipping.`);
                continue;
            }

            // Créer l'ingrédient
            await prisma.jobIngredient.create({
                data: {
                    jobId: jobId,
                    itemId: item.id,
                    quantity: ingredientQuantity
                }
            });
            console.info(`✅ Ingrédient ajouté : itemId ${item.id}, quantité ${ingredientQuantity}`);
        }

        console.info(`🎯 Création des ingrédients terminée pour le métier ${jobId}`);
    } catch (error) {
        console.error('❌ Erreur lors de la création des ingrédients :', error);
    } finally {
        await prisma.$disconnect();
    }
};

export const getMissingJobs = async () => {
    // Étape 1 : Récupération des objets qui n'ont pas de job associé.
    const itemsWithoutJob = await prisma.item.findMany({
        where: {
            Job: null,
        },
    });

    // Étape 2 : Boucle sur chaque objet sans job
    for (const item of itemsWithoutJob) {
        try {
            // Étape 3 : Appel API pour vérifier si l'objet a un job
            const itemResponse = await getItemFromApi(item.dofusdbId);

            if (itemResponse.hasRecipe) {
                console.info(`✅ Job trouvé pour l'objet ${item.name}`);

                // Récupération du craft
                const itemRecipe = await getItemRecipe(item.dofusdbId);

                if (!itemRecipe) {
                    console.info(`❌ Aucun craft trouvé pour l'objet ${item.name}`);
                    continue;
                }

                // Étape 4 : Mise à jour ou création du Job dans la base de données
                const savedJob = await prisma.job.upsert({
                    where: { resultItemId: item.id },
                    update: {
                        jobName: itemRecipe.job.name.fr,
                    },
                    create: {
                        resultItemId: item.id,
                        jobName: itemRecipe.job.name.fr,
                    },
                });

                // Création des composants
                await createJobIngredients(savedJob.id, itemRecipe);
            } else {
                console.info(`❌ Aucun job trouvé pour l'objet ${item.name}`);
            }
        } catch (error) {
            console.error(`🚨 Erreur lors de la récupération du job pour l'objet ${item.name}:`, error);
        }
    }

    console.info('🎯 Synchronisation des jobs terminée.');
}

export const repairJobs = async (maxLevelItem: number) => {
    console.info('🛠️ Début de la réparation des crafts...');

    const itemsData = await getItemsWithRecipeFromApi(1, maxLevelItem);

    let repairCount = 0;

    for (const itemData of itemsData) {
        // Recherche de l'objet dans la base de données
        const item = await prisma.item.findFirst({
            where: { dofusdbId: itemData.dofusdbId }
        });

        // Si l'objet n'existe pas, on le crée (comprenant ses drops, crafts, etc.)
        if (!item) {
            await createItemFromApi(itemData.dofusdbId);
            repairCount++;
            continue;
        }

        // Si l'objet existe, on vérifie si le craft existe
        let savedJob = await prisma.job.findFirst({
            where: { resultItemId: item.id }
        });

        const itemRecipe = await getItemRecipe(itemData.dofusdbId);

        if (!itemRecipe) {
            console.info(`❌ Aucun craft trouvé pour l'objet ${item.name}`);
            continue;
        }

        // Si le craft n'existe pas, on le crée
        if (!savedJob) {
            savedJob = await prisma.job.create({
                data: {
                    resultItemId: item.id,
                    jobName: itemRecipe.job.name.fr
                }
            });
        }

        // Puis on créer si besoin les composants du craft, ou sinon on les lie au craft précedemment créé
        await createJobIngredients(savedJob.id, itemRecipe);
        repairCount++;
    }

    repairCount++;

    console.info(`🎯 Réparation terminée. ${repairCount} craft(s) corrigé(s).`);
}
