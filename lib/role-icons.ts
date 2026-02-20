import { BadgeEuro, GraduationCap, BriefcaseBusiness, Users, User, Building2, University, Container, Volleyball, Stethoscope } from "lucide-react"

/**
 * Returns the appropriate Lucide icon component for a representative role/body name.
 */
export function getRoleIcon(roleName: string) {
    if (roleName.startsWith("CdA")) return BadgeEuro
    if (roleName.startsWith("SA ") || roleName.startsWith("SA(")) return GraduationCap
    if (roleName.startsWith("ERSU")) return BriefcaseBusiness
    if (roleName.startsWith("CdS")) return Users
    if (roleName.startsWith("CNSU")) return User
    if (roleName.startsWith("CSASU")) return Volleyball
    if (roleName.startsWith("SIR")) return Stethoscope
    // Fallbacks
    return Building2
}

/** Icon for the "Organi Centrali" section header */
export const CentralSectionIcon = University

/** Icon for the "Consigli di Dipartimento" section header */
export const DepartmentSectionIcon = Building2
