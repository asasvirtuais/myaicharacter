'use client'
import React from 'react'
import { TableProvider, useTable } from 'asasvirtuais/react-interface'
import { useInterface } from 'asasvirtuais/interface-provider'
import { schema, RecordReadable } from '.'

export function RecordsProvider({
  children,
  asAbove
}: {
  children: React.ReactNode
  asAbove?: Record<string, RecordReadable>
}) {
  const fetchInterface = useInterface()
  return (
    <TableProvider
      table="records"
      schema={schema}
      interface={fetchInterface}
      asAbove={asAbove}
    >
      {children}
    </TableProvider>
  )
}

export function useRecords() {
  return useTable('records', schema)
}
