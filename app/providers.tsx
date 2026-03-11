'use client'
import React from 'react'
import { IndexedInterfaceProvider } from 'asasvirtuais/indexed-interface'
import { DatabaseProvider } from 'asasvirtuais/react-interface'
import { CharactersProvider } from '@/app/characters/provider'
import { RecordsProvider } from '@/app/records/provider'
import { schema } from '@/app/schema'

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <IndexedInterfaceProvider dbName='chronicleDb' schema={schema}>
            <DatabaseProvider>
                <CharactersProvider>
                    <RecordsProvider>
                        {children}
                    </RecordsProvider>
                </CharactersProvider>
            </DatabaseProvider>
        </IndexedInterfaceProvider>
    )
}
