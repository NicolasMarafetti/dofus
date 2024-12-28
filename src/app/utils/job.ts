import { getItemMinPrice } from "./item";
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

export const deleteDuplicateJobIngredients = async () => {
    try {
        // Étape 1 : Récupérer tous les jobs avec leurs ingrédients
        const jobs = await prisma.job.findMany({
            include: {
                ingredients: true,
            },
        });

        for (const job of jobs) {
            const seenItems = new Set<string>(); // Pour suivre les itemId déjà rencontrés

            for (const ingredient of job.ingredients) {
                if (seenItems.has(ingredient.itemId)) {
                    // Si l'ingrédient a déjà été rencontré, on le supprime
                    await prisma.jobIngredient.delete({
                        where: {
                            id: ingredient.id,
                        },
                    });
                    console.log(
                        `Doublon supprimé: Job ${job.id}, Ingredient ${ingredient.itemId}`
                    );
                } else {
                    // Sinon, on l'ajoute au Set
                    seenItems.add(ingredient.itemId);
                }
            }
        }

        console.log('Doublons traités avec succès pour tous les jobs.');
    } catch (error) {
        console.error('Erreur lors du traitement des doublons:', error);
    } finally {
        await prisma.$disconnect();
    }
};