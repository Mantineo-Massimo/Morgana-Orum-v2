"use client"

import * as React from "react"
import { usePathname } from "@/i18n/routing"

export type Brand = "morgana" | "orum" | "unimhealth" | "economia" | "scipog" | "dicam" | "matricole" | null

interface BrandContextType {
  brand: Brand
  setBrand: (brand: Brand) => void
}

const BrandContext = React.createContext<BrandContextType | undefined>(undefined)

export function BrandProvider({
  children,
  defaultBrand = null,
}: {
  children: React.ReactNode
  defaultBrand?: Brand
}) {
  const [brand, setBrand] = React.useState<Brand>(defaultBrand)
  const pathname = usePathname()

  // Auto-detect brand from URL
  React.useEffect(() => {
    if (pathname.startsWith("/network/")) {
      const detectedBrand = pathname.split("/")[2] as Brand
      if (detectedBrand) setBrand(detectedBrand)
    } else if (pathname === "/") {
      setBrand(null) // Reset to default on home
    }
  }, [pathname])

  // Update body attribute when brand changes
  React.useEffect(() => {
    const root = document.documentElement
    if (brand) {
      root.setAttribute("data-brand", brand)
    } else {
      root.removeAttribute("data-brand")
    }
  }, [brand])

  return (
    <BrandContext.Provider value={{ brand, setBrand }}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = React.useContext(BrandContext)
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider")
  }
  return context
}
