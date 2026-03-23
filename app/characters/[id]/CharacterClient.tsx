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
    ActionIcon,
    Group,
    TypographyStylesProvider,
} from '@mantine/core'
import { IconSparkles, IconEdit, IconCheck, IconX, IconEye, IconMarkdown, IconPlus, IconTrash, IconHistory, IconBook, IconReceipt } from '@tabler/icons-react'
import ReactMarkdown from 'react-markdown'
import { SingleProvider, useSingle, UpdateForm, useTable, CreateForm } from 'asasvirtuais/react-interface'
import { schema, type Character } from '@/app/characters'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useCharacter } from '@/app/characters/provider'
import { useRecords } from '@/app/records/provider'
import { schema as recordsSchema } from '@/app/records'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'

// --- Records Components ---

function RecordCard({ record, isOwner }: { record: any, isOwner: boolean }) {
    const { remove } = useRecords()
    
    const handleDelete = async () => {
        if (!confirm('Delete this record?')) return
        try {
            await remove.trigger({ id: record.id })
            notifications.show({ title: 'Record deleted', message: 'The record was removed.', color: 'gray' })
        } catch (error: any) {
            notifications.show({ title: 'Error', message: error.message, color: 'red' })
        }
    }

    return (
        <Card withBorder radius="md" p="md" mb="sm">
            <Stack gap="sm">
                <Group justify="space-between" align="flex-start">
                    <Stack gap={2}>
                        <Group gap="xs">
                            <Text fw={600} size="md">{record.title}</Text>
                            {record.questline && (
                                <Badge variant="dot" color="blue" size="xs">{record.questline}</Badge>
                            )}
                        </Group>
                        <Text size="xs" c="dimmed">{new Date(record.datetime).toLocaleString()}</Text>
                    </Stack>
                    {isOwner && (
                        <ActionIcon variant="subtle" color="red" size="sm" onClick={handleDelete}>
                            <IconTrash size={14} />
                        </ActionIcon>
                    )}
                </Group>

                {record.type === 'lore' && record.image?.url && (
                    <Image 
                        src={record.image.url} 
                        alt={record.image.alt} 
                        radius="md" 
                        mah={200} 
                        fit="cover" 
                        style={{ border: '1px solid var(--mantine-color-dark-4)' }}
                    />
                )}

                {record.content && (
                    <TypographyStylesProvider>
                        <div className="markdown-content" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                            <ReactMarkdown>{record.content}</ReactMarkdown>
                        </div>
                    </TypographyStylesProvider>
                )}
            </Stack>
        </Card>
    )
}

function RecordList({ characterId, type, isOwner }: { characterId: string, type: string, isOwner: boolean }) {
    const { array: allRecords, loading } = useRecords()
    const records = allRecords
        .filter(r => r.character === characterId && r.type === type)
        .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())

    if (loading) return <Stack gap="sm">{[1, 2].map(i => <Skeleton key={i} height={100} radius="md" />)}</Stack>

    if (records.length === 0) {
        return (
            <Center py="xl">
                <Stack align="center" gap="xs">
                    <Text c="dimmed" size="sm" fs="italic">No {type} records yet.</Text>
                </Stack>
            </Center>
        )
    }

    return (
        <Stack gap="sm">
            {records.map(record => (
                <RecordCard key={record.id} record={record} isOwner={isOwner} />
            ))}
        </Stack>
    )
}

function AddRecordButton({ characterId, type, isOwner }: { characterId: string, type: 'lore' | 'activity' | 'log', isOwner: boolean }) {
    const [opened, setOpened] = React.useState(false)

    if (!isOwner) return null

    const labels = {
        lore: { title: 'Add Lore Record', icon: <IconBook size={16} /> },
        activity: { title: 'Record Activity', icon: <IconHistory size={16} /> },
        log: { title: 'Log Transaction', icon: <IconReceipt size={16} /> }
    }

    return (
        <>
            <Button 
                variant="light" 
                color="violet" 
                size="xs" 
                leftSection={<IconPlus size={14} />}
                onClick={() => setOpened(true)}
                mb="md"
            >
                {labels[type].title}
            </Button>

            <Modal 
                opened={opened} 
                onClose={() => setOpened(false)} 
                title={labels[type].title}
                centered
                size="lg"
            >
                <CreateForm 
                    table="records" 
                    schema={recordsSchema} 
                    onSuccess={() => {
                        setOpened(false)
                        notifications.show({ title: 'Record added!', message: 'Your story has been updated.', color: 'green' })
                    }} 
                    defaults={{ character: characterId, type, title: '' }}
                >
                    {({ fields, setField, submit, loading }) => (
                        <Stack gap="md">
                            <TextInput 
                                label="Title" 
                                placeholder={type === 'lore' ? "e.g. The Battle of Green Valley" : "What happened?"}
                                value={fields.title} 
                                onChange={(e) => setField('title', e.target.value)}
                                required
                                data-autofocus
                            />
                            
                            <TextInput 
                                label="Questline (Optional)" 
                                placeholder="e.g. Main Story, Side Quest: The Lost Ring"
                                value={fields.questline || ''} 
                                onChange={(e) => setField('questline', e.target.value)}
                            />

                            {type === 'lore' && (
                                <>
                                    <Textarea 
                                        label="Description" 
                                        placeholder="Tell the story..."
                                        value={fields.content || ''} 
                                        onChange={(e) => setField('content', e.target.value)}
                                        minRows={4}
                                        autosize
                                    />
                                    {/* TODO: Add Image Generation here as per roadmap */}
                                    <TextInput 
                                        label="Image URL (Optional)" 
                                        placeholder="https://..."
                                        value={fields.image?.url || ''} 
                                        onChange={(e) => setField('image', { ...fields.image, url: e.target.value, alt: fields.image?.alt || fields.title })}
                                    />
                                </>
                            ) : (
                                <Textarea 
                                    label="Additional Details (Optional)" 
                                    placeholder="Any more details?"
                                    value={fields.content || ''} 
                                    onChange={(e) => setField('content', e.target.value)}
                                    minRows={2}
                                    autosize
                                />
                            )}

                            <Group justify="flex-end">
                                <Button variant="subtle" onClick={() => setOpened(false)}>Cancel</Button>
                                <Button color="violet" onClick={() => submit()} loading={loading} disabled={!fields.title}>
                                    Save Record
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </CreateForm>
            </Modal>
        </>
    )
}

// --- Helper Components for Inline Editing ---

function EditableValue({ 
    id, 
    fieldName, 
    value = '', 
    children, 
    isOwner,
    multiline = false,
    align = 'center',
    placeholder = 'Enter value...'
}: { 
    id: string, 
    fieldName: string, 
    value?: string, 
    children: React.ReactNode, 
    isOwner: boolean,
    multiline?: boolean,
    align?: 'center' | 'left',
    placeholder?: string
}) {
    const [editing, setEditing] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)

    if (!isOwner) return <>{children}</>

    if (editing) {
        return (
            <Box style={{ width: '100%', maxWidth: multiline ? '100%' : '400px', margin: align === 'center' ? '0 auto' : undefined }}>
                <UpdateForm table="characters" schema={schema} id={id} onSuccess={() => setEditing(false)} defaults={{ [fieldName]: value }}>
                    {({ fields, setField, submit, loading }) => (
                        <Stack gap={8}>
                            {multiline ? (
                                <Textarea 
                                    placeholder={placeholder}
                                    value={fields[fieldName as keyof typeof fields] as string} 
                                    onChange={(e) => setField(fieldName as any, e.target.value)}
                                    autosize
                                    minRows={2}
                                    autoFocus
                                    styles={{
                                        input: { 
                                            borderColor: 'var(--mantine-color-violet-4)',
                                            '&:focus': { borderColor: 'var(--mantine-color-violet-5)' }
                                        }
                                    }}
                                />
                            ) : (
                                <TextInput 
                                    placeholder={placeholder}
                                    value={fields[fieldName as keyof typeof fields] as string} 
                                    onChange={(e) => setField(fieldName as any, e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                                    styles={{
                                        input: { 
                                            textAlign: align,
                                            borderColor: 'var(--mantine-color-violet-4)',
                                        }
                                    }}
                                />
                            )}
                            <Group gap={6} justify={align === 'center' ? 'center' : 'flex-end'}>
                                <Button 
                                    size="xs" 
                                    variant="light" 
                                    color="gray" 
                                    onClick={() => setEditing(false)}
                                    leftSection={<IconX size={14} />}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    size="xs" 
                                    color="violet" 
                                    onClick={() => submit()} 
                                    loading={loading}
                                    leftSection={<IconCheck size={14} />}
                                >
                                    Save
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </UpdateForm>
            </Box>
        )
    }

    return (
        <Box 
            onClick={() => setEditing(true)} 
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ 
                cursor: 'pointer', 
                borderRadius: '8px',
                position: 'relative',
                transition: 'background 0.2s ease',
                background: hovered ? 'rgba(139, 92, 246, 0.06)' : 'transparent',
            }} 
            px={10}
            py={6}
        >
            {children}
            {hovered && (
                <Box
                    style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        opacity: 0.5,
                        transition: 'opacity 0.2s ease',
                    }}
                >
                    <IconEdit size={14} color="var(--mantine-color-violet-4)" />
                </Box>
            )}
        </Box>
    )
}

function EditableSheet({ id, value, isOwner }: { id: string, value: string, isOwner: boolean }) {
    const [editing, setEditing] = React.useState(false)

    if (editing && isOwner) {
        return (
            <UpdateForm table="characters" schema={schema} id={id} onSuccess={() => setEditing(false)} defaults={{ details: value }}>
                {({ fields, setField, submit, loading }) => (
                    <Stack gap="md">
                        <Card withBorder p="md" radius="md">
                            <Stack gap="sm">
                                <Group justify="space-between" align="center">
                                    <Group gap={6}>
                                        <IconMarkdown size={16} opacity={0.6} />
                                        <Text size="xs" fw={600} tt="uppercase" c="dimmed">Markdown Editor</Text>
                                    </Group>
                                    <Badge size="xs" variant="light" color="violet">editing</Badge>
                                </Group>
                                <Textarea
                                    placeholder="Write your character sheet using markdown — headings, lists, bold, italic..."
                                    value={fields.details}
                                    onChange={(e) => setField('details', e.target.value)}
                                    autosize
                                    minRows={12}
                                    styles={{ 
                                        input: { 
                                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace', 
                                            fontSize: '13px',
                                            lineHeight: 1.6,
                                        } 
                                    }}
                                />
                            </Stack>
                        </Card>

                        <Box p="md">
                             <Stack gap="sm">
                                 <Group gap={6}>
                                     <IconEye size={16} opacity={0.6} />
                                     <Text size="xs" fw={600} tt="uppercase" c="dimmed">Preview</Text>
                                 </Group>
                                 <TypographyStylesProvider>
                                    <div className="markdown-content" style={{ lineHeight: 1.7 }}>
                                        <ReactMarkdown>{fields.details || '*Preview will appear here as you type...*'}</ReactMarkdown>
                                    </div>
                                 </TypographyStylesProvider>
                             </Stack>
                         </Box>

                        <Group justify="flex-end">
                            <Button variant="subtle" color="gray" onClick={() => setEditing(false)}>Cancel</Button>
                            <Button color="violet" loading={loading} onClick={() => submit()}>Save Sheet</Button>
                        </Group>
                    </Stack>
                )}
            </UpdateForm>
        )
    }

    return (
        <Stack gap="xs">
            {isOwner && (
                <Group justify="flex-end">
                    <Button leftSection={<IconEdit size={14}/>} variant="subtle" size="xs" onClick={() => setEditing(true)}>
                        Edit Sheet
                    </Button>
                </Group>
            )}
            <TypographyStylesProvider>
                <div className="markdown-content" style={{ lineHeight: 1.7 }}>
                    <ReactMarkdown>{value || 'No character sheet yet.'}</ReactMarkdown>
                </div>
            </TypographyStylesProvider>
        </Stack>
    )
}

function EditableNotes({ id, notes, isOwner }: { id: string, notes: string[], isOwner: boolean }) {
    const { update } = useCharacter()
    const [newNote, setNewNote] = React.useState('')
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
    const [editValue, setEditValue] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const handleAdd = async () => {
        if (!newNote.trim()) return
        setLoading(true)
        try {
            await update.trigger({ id, data: { notes: [...notes, newNote.trim()] } })
            setNewNote('')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveEdit = async (index: number) => {
        setLoading(true)
        try {
            const newNotes = [...notes]
            newNotes[index] = editValue.trim()
            await update.trigger({ id, data: { notes: newNotes } })
            setEditingIndex(null)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (index: number) => {
        if (!confirm('Delete this note?')) return
        setLoading(true)
        try {
            const newNotes = notes.filter((_, i) => i !== index)
            await update.trigger({ id, data: { notes: newNotes } })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Stack gap="md">
            {isOwner && (
                <Card withBorder p="xs" radius="sm">
                    <Group gap="xs">
                        <TextInput 
                            placeholder="Add a new note..." 
                            value={newNote} 
                            onChange={(e) => setNewNote(e.target.value)}
                            style={{ flex: 1 }}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <ActionIcon color="violet" onClick={handleAdd} loading={loading} disabled={!newNote.trim()}>
                            <IconPlus size={18} />
                        </ActionIcon>
                    </Group>
                </Card>
            )}

            {notes.length ? (
                <Stack gap="xs">
                    {notes.map((note, i) => (
                        <Card key={i} withBorder p="sm" radius="sm">
                            {editingIndex === i ? (
                                <Stack gap="xs">
                                    <Textarea 
                                        value={editValue} 
                                        onChange={(e) => setEditValue(e.target.value)} 
                                        autosize
                                        minRows={1}
                                    />
                                    <Group justify="flex-end" gap="xs">
                                        <ActionIcon color="green" onClick={() => handleSaveEdit(i)} loading={loading}>
                                            <IconCheck size={16} />
                                        </ActionIcon>
                                        <ActionIcon color="red" variant="light" onClick={() => setEditingIndex(null)}>
                                            <IconX size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Stack>
                            ) : (
                                <Group justify="space-between" align="flex-start" wrap="nowrap">
                                    <Text size="sm" style={{ flex: 1 }}>{note}</Text>
                                    {isOwner && (
                                        <Group gap={4}>
                                            <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => {
                                                setEditingIndex(i)
                                                setEditValue(note)
                                            }}>
                                                <IconEdit size={14} />
                                            </ActionIcon>
                                            <ActionIcon variant="subtle" color="red" size="sm" onClick={() => handleDelete(i)}>
                                                <IconTrash size={14} />
                                            </ActionIcon>
                                        </Group>
                                    )}
                                </Group>
                            )}
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Text c="dimmed" size="sm" ta="center" py="xl">No notes yet.</Text>
            )}
        </Stack>
    )
}


// --- Character Detail View ---

function CharacterSheet({ 
    claiming,
    onClaim 
}: { 
    claiming: boolean,
    onClaim: () => void 
}) {
    const { single, loading } = useSingle('characters', schema) as { single: Character | null, loading: boolean }
    const { user } = useUser()
    const isOwner = !!(user?.sub && single?.owner === user.sub)

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
    const { array: allRecords } = useRecords()
    const characterRecords = allRecords.filter(r => r.character === character.id)
    const loreCount = characterRecords.filter(r => r.type === 'lore').length
    const activityCount = characterRecords.filter(r => r.type === 'activity').length
    const logCount = characterRecords.filter(r => r.type === 'log').length

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
                    <EditableValue
                        id={character.id}
                        fieldName="name"
                        value={character.name || ''}
                        isOwner={isOwner}
                        placeholder="Character name"
                    >
                        <Title order={1} ta="center" style={{ letterSpacing: '-0.02em' }}>
                            {character.name}
                        </Title>
                    </EditableValue>

                    <EditableValue
                        id={character.id}
                        fieldName="label"
                        value={character.label || ''}
                        isOwner={isOwner}
                        placeholder="e.g. Dark Sorcerer, Elven Healer"
                    >
                        {character.label ? (
                            <Badge color="violet" variant="light" size="lg">
                                {character.label}
                            </Badge>
                        ) : isOwner ? (
                            <Badge color="gray" variant="dot" size="lg">
                                Add Label
                            </Badge>
                        ) : null}
                    </EditableValue>
                </Stack>

                {/* Definition / Bio */}
                <EditableValue
                    id={character.id}
                    fieldName="definition"
                    value={character.definition || ''}
                    isOwner={isOwner}
                    multiline
                    align="left"
                    placeholder="Write a short bio or description..."
                >
                    {character.definition ? (
                        <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                            {character.definition}
                        </Text>
                    ) : isOwner ? (
                        <Text c="dimmed" size="xs" fs="italic">
                            Click to add a short bio...
                        </Text>
                    ) : null}
                </EditableValue>


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
                                onClaim()
                            } else {
                                window.location.href = `/auth/login?returnTo=${encodeURIComponent(window.location.pathname + '?claim=true')}`
                            }
                        }}
                    >
                        Claim this Character
                    </Button>
                )}

                <Divider />

                <Tabs defaultValue="sheet" color="violet">
                    <Tabs.List grow>
                        <Tabs.Tab value="sheet">Sheet</Tabs.Tab>
                        <Tabs.Tab value="notes">
                            Notes {character.notes?.length ? `(${character.notes.length})` : ''}
                        </Tabs.Tab>
                        <Tabs.Tab value="lore">Lore {loreCount ? `(${loreCount})` : ''}</Tabs.Tab>
                        <Tabs.Tab value="activity">Activity {activityCount ? `(${activityCount})` : ''}</Tabs.Tab>
                        <Tabs.Tab value="logs">Logs {logCount ? `(${logCount})` : ''}</Tabs.Tab>
                        <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="sheet" pt="md">
                        <EditableSheet
                            id={character.id}
                            value={character.details || ''}
                            isOwner={isOwner}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="notes" pt="md">
                        <EditableNotes
                            id={character.id}
                            notes={character.notes || []}
                            isOwner={isOwner}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="lore" pt="md">
                        <AddRecordButton characterId={character.id} type="lore" isOwner={isOwner} />
                        <RecordList characterId={character.id} type="lore" isOwner={isOwner} />
                    </Tabs.Panel>

                    <Tabs.Panel value="activity" pt="md">
                        <AddRecordButton characterId={character.id} type="activity" isOwner={isOwner} />
                        <RecordList characterId={character.id} type="activity" isOwner={isOwner} />
                    </Tabs.Panel>

                    <Tabs.Panel value="logs" pt="md">
                        <AddRecordButton characterId={character.id} type="log" isOwner={isOwner} />
                        <RecordList characterId={character.id} type="log" isOwner={isOwner} />
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

function ClaimModal({ 
    character, 
    open, 
    onClose, 
    claiming,
    onClaim,
    success 
}: { 
    character: Character | null, 
    open: boolean, 
    onClose: () => void, 
    claiming: boolean,
    onClaim: () => void,
    success: boolean 
}) {
    const { user } = useUser()
    const router = useRouter()
    if (!character) return null

    return (
        <Modal
            opened={open}
            onClose={onClose}
            withCloseButton
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
                                loading={claiming}
                                onClick={onClaim}
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
    const { user } = useUser()
    const { update } = useCharacter()
    const [claimModalOpen, setClaimModalOpen] = React.useState(claim)
    const [claimSuccess, setClaimSuccess] = React.useState(false)
    const [claiming, setClaiming] = React.useState(false)

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

    const handleCloseModal = () => {
        setClaimModalOpen(false)
        setClaimSuccess(false)
    }

    return (
        <>
            <CharacterSheet 
                claiming={claiming}
                onClaim={handleClaim}
            />
            <ClaimModal 
                character={single} 
                open={claimModalOpen} 
                onClose={handleCloseModal}
                claiming={claiming}
                onClaim={handleClaim}
                success={claimSuccess}
            />
        </>
    )
}
