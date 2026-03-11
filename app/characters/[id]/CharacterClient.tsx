'use client'
import React from 'react'
import {
    Container,
    Title,
    Text,
    Stack,
    Image,
    Badge,
    Tabs,
    Card,
    Button,
    Modal,
    Center,
    Divider,
    Skeleton,
    Box,
    Textarea,
    TextInput,
    TagsInput,
    ActionIcon,
    Group,
    Tooltip,
} from '@mantine/core'
import { IconSparkles, IconEdit, IconCheck, IconX, IconEye, IconMarkdown } from '@tabler/icons-react'
import ReactMarkdown from 'react-markdown'
import { SingleProvider, useSingle, UpdateForm } from 'asasvirtuais/react-interface'
import { schema, type Character } from '@/app/characters'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useCharacter } from '@/app/characters/provider'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'

// --- Character Detail View ---

function CharacterSheet({ 
    claimTriggered, 
    claimSuccess, 
    setClaimSuccess 
}: { 
    claimTriggered?: boolean, 
    claimSuccess: boolean, 
    setClaimSuccess: (val: boolean) => void 
}) {
    const { single, loading } = useSingle('characters', schema) as { single: Character | null, loading: boolean }
    const { user } = useUser()
    const router = useRouter()
    const [claiming, setClaiming] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const isOwner = user?.sub && single?.owner === user.sub

    // Auto-claim if returning from login with ?claim=true
    React.useEffect(() => {
        if (claimTriggered && user && single && !single.owner && !claiming && !claimSuccess) {
            handleClaim()
        }
    }, [claimTriggered, user, single])

    const { update } = useCharacter()

    const handleClaim = async () => {
        if (!single || !user?.sub) return
        setClaiming(true)
        try {
            await update.trigger({ 
                id: single.id, 
                data: { owner: user.sub } as any 
            })
            setClaimSuccess(true)
            notifications.show({
                title: 'Success!',
                message: `${single.name} is now yours.`,
                color: 'green',
            })
        } catch (error: any) {
            notifications.show({
                title: 'Claim Failed',
                message: error.message,
                color: 'red',
            })
        } finally {
            setClaiming(false)
        }
    }

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
                {character.definition && !isEditing && (
                    <Text c="dimmed" size="sm" ta="left">
                        {character.definition}
                    </Text>
                )}

                {/* Edit Toggle */}
                {isOwner && (
                    <Group justify="center">
                        <Button
                            leftSection={isEditing ? <IconEye size={16} /> : <IconEdit size={16} />}
                            variant="light"
                            color={isEditing ? 'gray' : 'violet'}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'View Mode' : 'Edit Character'}
                        </Button>
                    </Group>
                )}

                {/* Chat & Claim CTA */}
                <Button
                    component="a"
                    href={`/characters/${character.id}/chat`}
                    color="violet"
                    variant="light"
                    size="md"
                >
                    Chat with {character.name}
                </Button>

                {!character.owner && (
                    <Button
                        color="orange"
                        variant="filled"
                        size="md"
                        loading={claiming}
                        onClick={() => {
                            if (user) {
                                handleClaim()
                            } else {
                                window.location.href = `/auth/login?returnTo=${encodeURIComponent(window.location.pathname + '?claim=true')}`
                            }
                        }}
                    >
                        Claim this Character
                    </Button>
                )}

                <Divider />

                {isEditing && isOwner && single ? (
                    <UpdateForm table="characters" schema={schema} id={single.id} onSuccess={() => setIsEditing(false)}>
                        {({ fields, setField, submit, loading }) => (
                            <Stack gap="md">
                                <Stack gap="xs">
                                    <TextInput label="Name" value={fields.name} onChange={(e) => setField('name', e.target.value)} />
                                    <TextInput label="Label" value={fields.label} onChange={(e) => setField('label', e.target.value)} />
                                    <Textarea label="Bio" value={fields.definition} onChange={(e) => setField('definition', e.target.value)} autosize minRows={2} />
                                </Stack>

                                <Tabs defaultValue="sheet" color="violet">
                                    <Tabs.List grow>
                                        <Tabs.Tab value="sheet">Sheet & Details</Tabs.Tab>
                                        <Tabs.Tab value="notes">Notes</Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="sheet" pt="md">
                                        <Card withBorder p="md" radius="md">
                                            <Stack gap="xs">
                                                <Group justify="space-between" align="center">
                                                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">Character Sheet (Markdown)</Text>
                                                    <IconMarkdown size={18} opacity={0.5} />
                                                </Group>
                                                <Textarea
                                                    placeholder="Write character sheet in markdown..."
                                                    value={fields.details}
                                                    onChange={(e) => setField('details', e.target.value)}
                                                    autosize
                                                    minRows={10}
                                                    styles={{ input: { fontFamily: 'monospace', fontSize: '13px' } }}
                                                />
                                                <Divider label="Preview" labelPosition="center" />
                                                <Box p="xs" bg="dark.7" style={{ borderRadius: 'var(--mantine-radius-sm)', border: '1px solid var(--mantine-color-dark-4)' }}>
                                                    <div className="markdown-preview" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                                                        <ReactMarkdown>{fields.details || '_Preview will appear here_'}</ReactMarkdown>
                                                    </div>
                                                </Box>
                                            </Stack>
                                        </Card>
                                    </Tabs.Panel>

                                    <Tabs.Panel value="notes" pt="md">
                                        <Stack gap="md">
                                            <TagsInput
                                                label="Character Notes"
                                                placeholder="Enter and press enter to add notes"
                                                value={fields.notes}
                                                onChange={(val) => setField('notes', val)}
                                            />
                                            <Text size="xs" c="dimmed">These notes are displayed in short cards in the view mode.</Text>
                                        </Stack>
                                    </Tabs.Panel>
                                </Tabs>

                                <Button fullWidth size="md" color="violet" loading={loading} onClick={() => submit()}>
                                    Save Character
                                </Button>
                            </Stack>
                        )}
                    </UpdateForm>
                ) : (
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
                                <div className="markdown-content" style={{ lineHeight: 1.7 }}>
                                    <ReactMarkdown>{character.details || 'No character sheet yet.'}</ReactMarkdown>
                                </div>
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
                )}
            </Stack>
        </Container>
    )
}

// --- Claim Modal ---

function ClaimModal({ 
    character, 
    open, 
    onClose, 
    success 
}: { 
    character: Character | null, 
    open: boolean, 
    onClose: () => void, 
    success: boolean 
}) {
    const { user } = useUser()
    const router = useRouter()
    if (!character) return null

    return (
        <Modal
            opened={open}
            onClose={onClose}
            withCloseButton={success}
            centered
            size="sm"
            overlayProps={{ backgroundOpacity: 0.7, blur: 8 }}
        >
            <Stack align="center" gap="md" p="md">
                {success ? (
                    <Stack align="center" gap="sm">
                        <Box p="md" style={{ borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)' }}>
                            <IconSparkles size={40} color="var(--mantine-color-violet-5)" />
                        </Box>
                        <Title order={3} ta="center">Successfully Claimed!</Title>
                        <Text size="sm" c="dimmed" ta="center">
                            {character.name} is now part of your collection.
                        </Text>
                        <Button
                            color="violet"
                            size="md"
                            fullWidth
                            onClick={() => {
                                router.replace(`/characters/${character.id}`)
                                onClose()
                            }}
                        >
                            See Character
                        </Button>
                    </Stack>
                ) : (
                    <>
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
                        <Box>
                            <Text size="sm" c="dimmed" ta="center">
                                You have been gifted a character.
                            </Text>
                            <Title order={3} ta="center">{character.name}</Title>
                        </Box>
                        {character.label && (
                            <Badge color="violet" variant="light">{character.label}</Badge>
                        )}
                        <Text size="sm" c="dimmed" ta="center">
                            {character.definition}
                        </Text>

                        {user ? (
                            <Button
                                color="violet"
                                size="md"
                                fullWidth
                                onClick={() => window.location.reload()} // The effect in CharacterSheet will handle it
                            >
                                Claim Now
                            </Button>
                        ) : (
                            <Button
                                color="violet"
                                size="md"
                                fullWidth
                                component="a"
                                href={`/auth/login?returnTo=${encodeURIComponent(window.location.pathname + '?claim=true')}`}
                            >
                                Login to Claim
                            </Button>
                        )}
                    </>
                )}
            </Stack>
        </Modal>
    )
}

export function CharacterClient({ id, claim }: { id: string, claim: boolean }) {
    return (
        <SingleProvider id={id} table="characters" schema={schema}>
            <CharacterClientInner claim={claim} />
        </SingleProvider>
    )
}

function CharacterClientInner({ claim }: { claim: boolean }) {
    const { single } = useSingle('characters', schema) as { single: Character | null }
    const [claimSuccess, setClaimSuccess] = React.useState(false)

    return (
        <>
            <CharacterSheet 
                claimTriggered={claim} 
                claimSuccess={claimSuccess} 
                setClaimSuccess={setClaimSuccess} 
            />
            <ClaimModal 
                character={single} 
                open={claim} 
                onClose={() => setClaimSuccess(false)}
                success={claimSuccess}
            />
        </>
    )
}
