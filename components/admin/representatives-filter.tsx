"use client"

import { Search, Filter, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useState } from "react"

export function RepresentativesFilter() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    // Local state for immediate feedback
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query')?.toString() || '')

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleFilter = (filterType: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'all') {
            params.set(filterType, value)
        } else {
            params.delete(filterType)
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const currentList = searchParams.get('list') || 'all'
    const currentCategory = searchParams.get('category') || 'all'

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
            {/* Search Bar */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Cerca per nome o ruolo..."
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        handleSearch(e.target.value)
                    }}
                />
                {searchTerm && (
                    <button
                        onClick={() => {
                            setSearchTerm('')
                            handleSearch('')
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <select
                    className="px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white text-sm"
                    value={currentList}
                    onChange={(e) => handleFilter('list', e.target.value)}
                >
                    <option value="all">Tutte le Liste</option>
                    <option value="MORGANA">Morgana</option>
                    <option value="O.R.U.M.">O.R.U.M.</option>
                    <option value="AZIONE">Azione</option>
                </select>

                <select
                    className="px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white text-sm"
                    value={currentCategory}
                    onChange={(e) => handleFilter('category', e.target.value)}
                >
                    <option value="all">Tutte le Categorie</option>
                    <option value="DEPARTMENT">Dipartimenti</option>
                    <option value="CENTRAL">Organi Centrali</option>
                    <option value="NATIONAL">Organi Nazionali</option>
                </select>
            </div>
        </div>
    )
}
