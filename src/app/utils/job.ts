import { createItemFromApi, getItemFromApi, getItemMinPrice, getItemRecipe, ItemResponse } from "./item";
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

export const createJobIngredients = async (jobId: string, recipeData: ItemResponse) => {
    // Création des objets ingrédients
    for (const ingredientId of recipeData.ingredientIds) {
        await createItemFromApi(ingredientId, false);
    }

    // Enregistrement des composants du craft
    for (const key in recipeData.ingredientIds) {
        const ingredientId = recipeData.ingredientIds[key];
        const ingredientQuantity = recipeData.quantities[key];

        // Recherche de l'objet
        const item = await prisma.item.findFirst({
            where: { dofusdbId: ingredientId }
        });

        if (!item) {
            console.error(`Item not found with dofusdbId: ${ingredientId}`);
            continue;
        }

        await prisma.jobIngredient.create({
            data: {
                jobId: jobId,
                itemId: item.id,
                quantity: ingredientQuantity
            }
        });
    }
}

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
                console.log(`✅ Job trouvé pour l'objet ${item.name}`);

                // Récupération du craft
                const itemRecipe = await getItemRecipe(item.dofusdbId);

                if (!itemRecipe) {
                    console.log(`❌ Aucun craft trouvé pour l'objet ${item.name}`);
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
                console.log(`❌ Aucun job trouvé pour l'objet ${item.name}`);
            }
        } catch (error) {
            console.error(`🚨 Erreur lors de la récupération du job pour l'objet ${item.name}:`, error);
        }
    }

    console.log('🎯 Synchronisation des jobs terminée.');
}
