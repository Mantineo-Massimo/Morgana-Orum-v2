export const ASSOCIATIONS = [
    { id: "MORGANA_ORUM", name: "Morgana & O.R.U.M.", brandId: "morgana" },
    { id: "UNIMHEALTH", name: "Unimhealth", brandId: "unimhealth" },
    { id: "ECONOMIA", name: "Studenti Economia", brandId: "economia" },
    { id: "SCIPOG", name: "Studenti SCIPOG", brandId: "scipog" },
    { id: "DICAM", name: "Dicam", brandId: "dicam" },
    { id: "INSIDE_DICAM", name: "Inside DICAM", brandId: "dicam" },
    { id: "MATRICOLE", name: "Unime Matricole", brandId: "matricole" },
] as const;

export type AssociationId = typeof ASSOCIATIONS[number]["id"];

export function getAssociationName(id: string) {
    return ASSOCIATIONS.find(a => a.id === id)?.name || id;
}

export function getBrandForAssociation(id: string): string {
    const found = ASSOCIATIONS.find(a => a.id === id);
    return found?.brandId || "orum";
}
