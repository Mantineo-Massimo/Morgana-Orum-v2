export const ASSOCIATIONS = [
    { id: "morgana-orum", name: "Morgana & O.R.U.M." },
    { id: "unimhealth", name: "Unimhealth" },
    { id: "studentieconomia", name: "Studenti Economia" },
    { id: "studentiscipog", name: "Studenti Scipog" },
    { id: "insidedicam", name: "Inside Dicam" },
    { id: "unimematricole", name: "Unime Matricole" },
] as const;

export type AssociationId = typeof ASSOCIATIONS[number]["id"];

export function getAssociationName(id: string) {
    return ASSOCIATIONS.find(a => a.id === id)?.name || id;
}
