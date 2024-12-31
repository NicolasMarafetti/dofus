// Récupère les informations détaillées d'un effet depuis l'API
export async function fetchEffectsFromAPI(effectId: number) {
  try {
    const response = await fetch(`https://api.dofusdb.fr/effects/${effectId}?lang=fr`);
    if (!response.ok) {
      throw new Error(`Erreur API pour l'effet ${effectId}`);
    }
    const data: {
      bonusType: number;
      characteristic: number;
      description: { fr: string };
      effectPowerRate: number;
    } = await response.json();

    return data || null;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de l'effet :", error);
    return null;
  }
}