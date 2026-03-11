'use client'
import React, { use } from 'react'
import {
    Container,
    Title,
    Text,
    Stack,
    Image,
    Badge,
    Tabs,
    Card,
    Group,
    Button,
    Modal,
    Center,
    Divider,
    List,
    Skeleton,
} from '@mantine/core'
import { SingleProvider, useSingle } from 'asasvirtuais/react-interface'
import { schema, type Character } from '@/app/characters'

// --- Character Detail View ---

function CharacterSheet() {
    const { single, loading } = useSingle('characters', schema) as { single: Character | null, loading: boolean }

    if (loading || !single) {
        return (
            <Container size="sm" py="xl">
                <Stack gap="md" align="center">
                    <Skeleton height={400} width={300} radius="md" />
                    <Skeleton height={30} width={200} />
                    <Skeleton height={20} width={120} />
                    <Skeleton height={60} width="100%" />
                </Stack>
            </Container>
        )
    }

    const character = single

    return (
        <Container size="sm" py="xl">
            <Stack gap="lg">
                {/* Portrait */}
                <Center>
                    {character.image?.url ? (
                        <Image
                            src={character.image.url}
                            alt={character.image.alt}
                            radius="md"
                            w={300}
                            h={400}
                            fit="cover"
                            style={{
                                boxShadow: '0 8px 32px rgba(128, 90, 213, 0.2)',
                                border: '1px solid rgba(128, 90, 213, 0.15)',
                            }}
                        />
                    ) : (
                        <Center
                            w={300}
                            h={400}
                            bg="dark.6"
                            style={{ borderRadius: 'var(--mantine-radius-md)', border: '1px solid var(--mantine-color-dark-4)' }}
                        >
                            <Title order={1} c="dimmed" style={{ fontSize: '4rem', opacity: 0.3 }}>
                                {character.name?.charAt(0) || '?'}
                            </Title>
                        </Center>
                    )}
                </Center>

                {/* Name + Label */}
                <Stack gap={4} align="center">
                    <Title order={1} ta="center" style={{ letterSpacing: '-0.02em' }}>
                        {character.name}
                    </Title>
                    {character.label && (
                        <Badge color="violet" variant="light" size="lg">
                            {character.label}
                        </Badge>
                    )}
                </Stack>

                {/* Definition / Bio */}
                {character.definition && (
                    <Text c="dimmed" size="sm" ta="left">
                        {character.definition}
                    </Text>
                )}

                {/* Chat CTA */}
                <Center>
                    <Button
                        component="a"
                        href={`/characters/${character.id}/chat`}
                        color="violet"
                        variant="light"
                        size="md"
                    >
                        Chat with {character.name}
                    </Button>
                </Center>

                <Divider />

                {/* Tabs: Sheet | Notes | Lore | Activity | Logs | Gallery */}
                <Tabs defaultValue="sheet" color="violet">
                    <Tabs.List grow>
                        <Tabs.Tab value="sheet">Sheet</Tabs.Tab>
                        <Tabs.Tab value="notes">
                            Notes {character.notes?.length ? `(${character.notes.length})` : ''}
                        </Tabs.Tab>
                        <Tabs.Tab value="lore">Lore</Tabs.Tab>
                        <Tabs.Tab value="activity">Activity</Tabs.Tab>
                        <Tabs.Tab value="logs">Logs</Tabs.Tab>
                        <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="sheet" pt="md">
                        <Card withBorder p="md" radius="md">
                            <Text
                                size="sm"
                                style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}
                            >
                                {character.details || 'No character sheet yet.'}
                            </Text>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="notes" pt="md">
                        {character.notes?.length ? (
                            <Stack gap="xs">
                                {character.notes.map((note: string, i: number) => (
                                    <Card key={i} withBorder p="sm" radius="sm">
                                        <Text size="sm">{note}</Text>
                                    </Card>
                                ))}
                            </Stack>
                        ) : (
                            <Text c="dimmed" size="sm" ta="center" py="xl">
                                No notes yet.
                            </Text>
                        )}
                    </Tabs.Panel>

                    <Tabs.Panel value="lore" pt="md">
                        <Text c="dimmed" size="sm" ta="center" py="xl" fs="italic">
                            No records yet. Your story is waiting to be written.
                        </Text>
                    </Tabs.Panel>

                    <Tabs.Panel value="activity" pt="md">
                        <Text c="dimmed" size="sm" ta="center" py="xl" fs="italic">
                            No activity recorded.
                        </Text>
                    </Tabs.Panel>

                    <Tabs.Panel value="logs" pt="md">
                        <Text c="dimmed" size="sm" ta="center" py="xl" fs="italic">
                            No logs recorded.
                        </Text>
                    </Tabs.Panel>

                    <Tabs.Panel value="gallery" pt="md">
                        {character.image?.url ? (
                            <Center>
                                <Image
                                    src={character.image.url}
                                    alt={character.image.alt}
                                    radius="md"
                                    maw={400}
                                    fit="contain"
                                />
                            </Center>
                        ) : (
                            <Text c="dimmed" size="sm" ta="center" py="xl" fs="italic">
                                No images yet.
                            </Text>
                        )}
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </Container>
    )
}

// --- Claim Modal ---

function ClaimModal({ character, open }: { character: Character | null, open: boolean }) {
    if (!character) return null

    return (
        <Modal
            opened={open}
            onClose={() => {}}
            withCloseButton={false}
            centered
            size="sm"
            overlayProps={{ backgroundOpacity: 0.7, blur: 8 }}
        >
            <Stack align="center" gap="md" p="md">
                {character.image?.url && (
                    <Image
                        src={character.image.url}
                        alt={character.image.alt}
                        radius="md"
                        w={180}
                        h={240}
                        fit="cover"
                    />
                )}
                <Text size="sm" c="dimmed" ta="center">
                    You have been gifted a character.
                </Text>
                <Title order={3} ta="center">{character.name}</Title>
                {character.label && (
                    <Badge color="violet" variant="light">{character.label}</Badge>
                )}
                <Text size="sm" c="dimmed" ta="center">
                    {character.definition}
                </Text>
                <Button
                    color="violet"
                    size="md"
                    fullWidth
                    component="a"
                    href="/auth/login"
                >
                    Claim this Character
                </Button>
            </Stack>
        </Modal>
    )
}

// --- Page Wrapper ---

function CharacterPageInner({ claim }: { claim: boolean }) {
    const { single } = useSingle('characters', schema) as { single: Character | null }

    return (
        <>
            <CharacterSheet />
            <ClaimModal character={single} open={claim} />
        </>
    )
}

export default function CharacterPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ claim?: string }>
}) {
    const { id } = use(params)
    const { claim } = use(searchParams)

    return (
        <SingleProvider id={id} table="characters" schema={schema}>
            <CharacterPageInner claim={claim !== undefined} />
        </SingleProvider>
    )
}
