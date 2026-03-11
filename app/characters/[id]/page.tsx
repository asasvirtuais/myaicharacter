import { CharacterClient } from './CharacterClient'

export default async function CharacterPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ claim?: string }>
}) {
    const { id } = await params
    const { claim } = await searchParams

    return <CharacterClient id={id} claim={claim !== undefined} />
}
