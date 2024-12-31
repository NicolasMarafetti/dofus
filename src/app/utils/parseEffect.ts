/**
 * Nettoie la description brute d'un effet pour extraire uniquement le nom du statut.
 * @param description - La description brute de l'effet depuis l'API.
 * @returns Le nom du statut nettoyé.
 */
export function cleanEffectDescription(description: string): string {
    // Retirer les placeholders comme #1, #2, {{~ps}}, {{~zs}}, etc.
    return description
        .replace(/#\d+/g, '') // Retire les #2, #1, etc.
        .replace(/\{\{[^}]+\}\}/g, '') // Retire {{~ps}}, {{~zs}}, etc.
        .replace(/{{[^}]+}}/g, '') // Prend en compte d'autres structures {{...}}
        .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul
        .trim(); // Retire les espaces inutiles au début et à la fin
}
