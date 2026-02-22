export const ASSOCIATIONS = [
    { id: "MORGANA_ORUM", name: "Morgana & O.R.U.M." },
    { id: "UNIMHEALTH", name: "Unimhealth" },
    { id: "ECONOMIA", name: "Studenti Economia" },
    { id: "SCIPOG", name: "Studenti SCIPOG" },
    { id: "DICAM", name: "Dicam" },
    { id: "INSIDE_DICAM", name: "Inside DICAM" },
    { id: "MATRICOLE", name: "Unime Matricole" },
] as const;

export const ASSOCIATION_DEPARTMENT_KEYWORDS: Record<string, string[]> = {
    DICAM: ["DICAM"],
    INSIDE_DICAM: ["DICAM"],
    SCIPOG: ["scipog"],
    UNIMHEALTH: ["Biomorf", "patologia", "dimed"],
    ECONOMIA: ["economia"],
}

export type AssociationId = typeof ASSOCIATIONS[number]["id"];

export function getAssociationName(id: string) {
    return ASSOCIATIONS.find(a => a.id === id)?.name || id;
}
