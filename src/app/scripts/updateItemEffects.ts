import { PrismaClient } from '@prisma/client';
import { getItemFromApi } from '../utils/item';
import { cleanEffectDescription } from '../utils/parseEffect';
import { CATEGORY_MAPPING } from '../constants/constants';
import { fetchEffectsFromAPI } from '../utils/effects';

const prisma = new PrismaClient();

// Met à jour les effets des objets
export async function updateItemEffects(characterLevel: number, reExportAlreadyUpdatedItems = false) {
  try {
    const items = await prisma.item.findMany({
      where: { level: { lte: characterLevel } },
    });

    const equipmentsItems = items.filter((item) => {
      if (!item.categoryName) return false;
      return CATEGORY_MAPPING['Équipements'].includes(item.categoryName);
    });

    for (const item of equipmentsItems) {
      if (item.effects && !reExportAlreadyUpdatedItems) {
        continue;
      }

      const itemData = await getItemFromApi(item.dofusdbId);
      const itemEffects = itemData.effects;

      if (!itemEffects || itemEffects.length === 0) {
        continue;
      }

      const finalItemEffects = [];

      for (const effect of itemEffects) {
        const effectData = await fetchEffectsFromAPI(effect.effectId);

        if (!effectData) {
          continue;
        }

        const { effectPowerRate } = effectData;
        if (effectPowerRate === 0) {
          continue;
        }

        // Si ce n'est pas une caractéristique
        if (!effectData.characteristic) {
          continue;
        }

        // On ne prend que ce qui est bonusType 1 (non, par exemple la sagesse en négative / les PA en négatif)
        /*
        if (effectData.bonusType !== 1) {
          continue;
        }
        */

        const effectDescriptionFr = cleanEffectDescription(effectData.description.fr);

        finalItemEffects.push({
          from: effect.from,
          to: effect.to,
          effect: effectDescriptionFr,
          effectPowerRate: parseFloat(effectPowerRate.toFixed(2))
        });
      }

      if (finalItemEffects.length === 0) {
        continue;
      }

      // Mise à jour de la base de données
      await prisma.item.update({
        where: { id: item.id },
        data: { effects: JSON.stringify(finalItemEffects) },
      });
    }

    console.info('🎉 Tous les objets ont été mis à jour avec succès.');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des objets :', error);
  } finally {
    await prisma.$disconnect();
  }
}
