'use client'
import React from 'react'
import { TableProvider, useTable } from 'asasvirtuais/react-interface'
import { useInterface } from 'asasvirtuais/interface-provider'
import { schema, Character } from '.'

export function CharactersProvider({
  children,
  asAbove
}: {
  children: React.ReactNode
  asAbove?: Record<string, Character>
}) {
  const fetchInterface = useInterface()
  return (
    <TableProvider
      table="characters"
      schema={schema}
      interface={fetchInterface}
      asAbove={asAbove}
    >
      {children}
    </TableProvider>
  )
}

export function useCharacters() {
  return useTable('characters', schema)
}
