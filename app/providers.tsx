import { InterfaceProvider } from 'asasvirtuais/interface-provider'
import { DatabaseProvider } from 'asasvirtuais/react-interface'
import { CharactersProvider } from '@/app/characters/provider'
import { RecordsProvider } from '@/app/records/provider'
import { schema } from '@/app/schema'
import * as db from '@/lib/actions/db'

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <InterfaceProvider 
            find={db.find}
            list={db.list}
            create={db.create}
            update={db.update}
            remove={db.remove}
        >
            <DatabaseProvider>
                <CharactersProvider>
                    <RecordsProvider>
                        {children}
                    </RecordsProvider>
                </CharactersProvider>
            </DatabaseProvider>
        </InterfaceProvider>
    )
}
