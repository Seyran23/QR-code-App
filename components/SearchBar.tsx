// components/search-bar.tsx
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SearchBarProps } from "@/types"


export function SearchBar({ 
  placeholder = "Search...", 
  onSearch,
  className 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, onSearch])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-4 py-2"
      />
    </div>
  )
}