export const ASSOCIATIONS = [
    { id: "MORGANA_ORUM", name: "Morgana & O.R.U.M." },
] as const;

export const ASSOCIATION_DEPARTMENT_KEYWORDS: Record<string, string[]> = {};

export type AssociationId = typeof ASSOCIATIONS[number]["id"];

export function getAssociationName(id: string) {
    return ASSOCIATIONS.find(a => a.id === id)?.name || id;
}
