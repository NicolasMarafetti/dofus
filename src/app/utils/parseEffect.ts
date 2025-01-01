/**
 * Nettoie la description brute d'un effet pour extraire uniquement le nom du statut.
 * @param description - La description brute de l'effet depuis l'API.
 * @returns Le nom du statut nettoyé.
 */
export function cleanEffectDescription(description: string): string {
    return description
        // Retirer les placeholders comme #1, #2
        .replace(/#\d+\s*/g, '') // Supprime #1, #2 avec l'espace après
        // Retirer les placeholders dynamiques {{~ps}}, {{~zs}}, etc.
        .replace(/\{\{[^}]+\}\}/g, '') // Supprime les structures comme {{~ps}}
        // Retirer les espaces multiples
        .replace(/\s{2,}/g, ' ') // Remplace les espaces multiples par un seul
        // Retirer les tirets et espaces inutiles
        .replace(/^-/, '') // Supprime un tiret au début
        // Nettoyer les restes de texte non pertinents
        .replace(/Dommage{{~ps}}{{~zs}}/g, 'Dommage')
        .replace(/Pod{{~ps}}{{~zs}}/g, 'Pod')
        .replace(/Invocation{{~ps}}{{~zs}}/g, 'Invocation')
        // Retirer les espaces au début et à la fin
        .trim();
}
