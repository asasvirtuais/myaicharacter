'use client'
import { IndexedInterfaceProvider } from 'asasvirtuais/indexed-interface'
import { schema } from '@/app/schema'

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <IndexedInterfaceProvider dbName='nextTemplateDb' schema={schema}>
            {children}
        </IndexedInterfaceProvider>
    )
}
