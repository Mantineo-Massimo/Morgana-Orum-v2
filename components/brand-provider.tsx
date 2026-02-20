"use client"

import * as React from "react"

type Brand = "morgana" | "orum" | null

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
