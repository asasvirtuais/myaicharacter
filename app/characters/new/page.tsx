'use client'
import React, { useState } from 'react'
import {
    NameField,
    LabelField,
    DefinitionField,
    DetailsField,
    NotesField,
    ImageField,
} from 'asasvirtuais-characters/fields'
import { SingleCharacter } from 'asasvirtuais-characters/components'
import { CreateForm, SingleProvider } from 'asasvirtuais/react-interface'
import { schema } from '@/app/characters'
import type { Writable } from 'asasvirtuais-characters'
import { z } from 'zod'
import { GeminiObject, GeminiImage } from 'asasvirtuais-gemini'
import { useUser } from '@auth0/nextjs-auth0/client'
import { FileButton, Divider, Loader, Image, Center, Badge, Group, Button, Stack, Text, Title, Container, Stepper, Card, Textarea, Box } from '@mantine/core'
import { IconUpload, IconSparkles, IconUser, IconSettings, IconPhoto, IconCheck, IconRocket } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

const generationSchema = z.object({
    name: z.string().describe("Full name of the character (e.g. 'Kaelen Varg')"),
    label: z.string().describe("A title or archetype (e.g. 'Barbarian of the Iron-Spine')"),
    definition: z.string().describe("A snappy one-line bio for listings"),
    details: z.string().describe("A single, long string containing the full character sheet, backstory and personality. DO NOT return an object here, JUST TEXT."),
    notes: z.array(z.string()).describe("An array of short string facts"),
    image: z.object({
        alt: z.string().describe("Portrait description for AI generation"),
    }),
})

type GeneratedOutput = z.infer<typeof generationSchema>

// const GEMINI_API_BASE = 'http://localhost:3001/api/gemini'
const GEMINI_API_BASE = 'https://asasvirtuais.dev/api/gemini'

export default function NewCharacterPage() {
    const { user, isLoading: authLoading } = useUser()
    const [step, setStep] = useState(0)
    const [idea, setIdea] = useState('')
    const [generated, setGenerated] = useState<Writable | null>(null)
    const [createdId, setCreatedId] = useState<string | null>(null)

    const handleUpload = (file: File | null, setField: (name: any, value: any) => void, currentImage: any) => {
        if (!file) return
        const reader = new FileReader()
        reader.onload = (e) => {
            const base64 = e.target?.result as string
            setField('image', { alt: currentImage?.alt || '', url: base64 })
        }
        reader.readAsDataURL(file)
    }

    if (authLoading) {
        return (
            <Center py="100px">
                <Loader size="xl" color="violet" />
            </Center>
        )
    }

    if (!user) {
        return (
            <Container size="sm" py="100px">
                <Card withBorder p="xl" radius="md" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <Stack align="center" gap="lg">
                        <Box p="md" style={{ borderRadius: '50%', background: 'rgba(128, 90, 213, 0.1)' }}>
                            <IconUser size={40} color="var(--mantine-color-violet-5)" />
                        </Box>
                        <Stack align="center" gap={4}>
                            <Title order={2}>Members Only</Title>
                            <Text c="dimmed" ta="center">You must be signed in to create and save new characters to the chronicle.</Text>
                        </Stack>
                        <Button
                            size="lg"
                            color="violet"
                            component="a"
                            href={`/auth/login?returnTo=${encodeURIComponent('/characters/new')}`}
                        >
                            Sign In / Sign Up
                        </Button>
                    </Stack>
                </Card>
            </Container>
        )
    }

    return (
        <Container size="sm" py="xl">
            {/* Existing content */}
            <Stack gap="xl">
                <Stack gap={0} align="center">
                    <Title order={1} style={{ letterSpacing: '-0.02em', fontSize: '2.5rem' }}>
                        Character Creator
                    </Title>
                    <Text c="dimmed" size="sm">Craft your next legend from a spark of imagination</Text>
                </Stack>

                {!generated ? (
                    <Stepper
                        active={0}
                        onStepClick={(s) => s < step && setStep(s)}
                        size="sm"
                        color="violet"
                        allowNextStepsSelect={false}
                    >
                        <Stepper.Step
                            label="Ideation"
                            description="Vibe & Story"
                            icon={<IconSparkles size={18} />}
                        >
                            <GeminiObject<GeneratedOutput>
                                api={`${GEMINI_API_BASE}/object`}
                                schema={generationSchema}
                                instructions="YOU MUST return ALL fields. Include 'name', 'label' (archetype), 'definition' (one-liner), 'details' (HUGE raw text backstory), 'notes' (array), and MUST provide a 'image.alt' field with a very detailed visual portrait description."
                            >
                                {({ submit, isLoading }) => (
                                    <Card withBorder p="xl" mt="xl" radius="md" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <Stack gap="md">
                                            <Text size="lg" fw={500}>The Spark</Text>
                                            <Text c="dimmed" size="sm">
                                                Tell me about the character you have in mind. A sentence, a vibe, a full backstory — whatever you have. Gemini will flesh out the details.
                                            </Text>
                                            <Textarea
                                                placeholder="A blind oracle who trades prophecies for memories. They carry a lantern that glows with stolen secrets..."
                                                minRows={5}
                                                autosize
                                                maxRows={10}
                                                value={idea}
                                                onChange={e => setIdea(e.target.value)}
                                                styles={{
                                                    input: { fontSize: '1rem', lineHeight: 1.6, borderRadius: '8px' },
                                                }}
                                            />
                                            <Group justify="flex-end">
                                                <Button
                                                    size="lg"
                                                    color="violet"
                                                    loading={isLoading}
                                                    leftSection={<IconSparkles size={18} />}
                                                    onClick={async () => {
                                                        const result = await submit(idea)
                                                        if (result) {
                                                            const writableResult: Writable = {
                                                                ...result,
                                                                image: {
                                                                    alt: result.image.alt,
                                                                    url: '',
                                                                }
                                                            }
                                                            setGenerated(writableResult)
                                                            setStep(1)
                                                        }
                                                    }}
                                                    disabled={!idea.trim() || isLoading}
                                                    variant="filled"
                                                >
                                                    Generate Concept
                                                </Button>
                                            </Group>
                                        </Stack>
                                    </Card>
                                )}
                            </GeminiObject>
                        </Stepper.Step>
                        <Stepper.Step label="Identity" description="Core traits" icon={<IconUser size={18} />} />
                        <Stepper.Step label="Details" description="Backstory" icon={<IconSettings size={18} />} />
                        <Stepper.Step label="Portrait" description="Visuals" icon={<IconPhoto size={18} />} />
                        <Stepper.Step label="Review" description="Share character" icon={<IconRocket size={18} />} />
                    </Stepper>
                ) : (
                    <CreateForm
                        table="characters"
                        schema={schema}
                        defaults={generated as any}
                        onSuccess={(character: any) => {
                            setCreatedId(character.id)
                            setStep(4)
                        }}
                    >
                        {form => (
                            <Stepper
                                active={step}
                                onStepClick={(s) => s < step && setStep(s)}
                                size="sm"
                                color="violet"
                                allowNextStepsSelect={false}
                            >
                                <Stepper.Step
                                    label="Ideation"
                                    description="Vibe & Story"
                                    icon={<IconSparkles size={18} />}
                                >
                                    <Card withBorder p="xl" mt="xl" radius="md">
                                        <Stack align="center" py="xl">
                                            <IconCheck size={40} color="green" />
                                            <Text fw={500} size="lg">Concept Generated!</Text>
                                            <Text c="dimmed" ta="center">You have a solid foundation. Continue to refine the details.</Text>
                                            <Button variant="light" color="violet" mt="md" onClick={() => setStep(1)}>
                                                Next: Refine Identity
                                            </Button>
                                            <Button variant="subtle" color="gray" size="xs" mt="xl" onClick={() => setGenerated(null)}>
                                                Start over with new idea
                                            </Button>
                                        </Stack>
                                    </Card>
                                </Stepper.Step>

                                <Stepper.Step
                                    label="Identity"
                                    description="Core traits"
                                    icon={<IconUser size={18} />}
                                >
                                    <Card withBorder p="xl" mt="xl" radius="md">
                                        <Stack gap="lg">
                                            <Title order={3}>Who are they?</Title>
                                            <NameField />
                                            <LabelField />
                                            <DefinitionField />
                                            <Group justify="space-between" mt="xl">
                                                <Button variant="subtle" color="gray" onClick={() => setStep(0)}>Back</Button>
                                                <Button color="violet" onClick={() => setStep(2)}>Continue to Details →</Button>
                                            </Group>
                                        </Stack>
                                    </Card>
                                </Stepper.Step>

                                <Stepper.Step
                                    label="Details"
                                    description="Backstory"
                                    icon={<IconSettings size={18} />}
                                >
                                    <Card withBorder p="xl" mt="xl" radius="md">
                                        <Stack gap="lg">
                                            <Title order={3}>The Details</Title>
                                            <Text size="sm" c="dimmed">
                                                Think of this as the main character sheet. Include traits, features, and key observations that define their personality and background.
                                            </Text>
                                            <DetailsField />
                                            <NotesField />
                                            <Group justify="space-between" mt="xl">
                                                <Button variant="subtle" color="gray" onClick={() => setStep(1)}>Back</Button>
                                                <Button color="violet" onClick={() => setStep(3)}>Continue to Portrait →</Button>
                                            </Group>
                                        </Stack>
                                    </Card>
                                </Stepper.Step>

                                <Stepper.Step
                                    label="Portrait"
                                    description="Visuals"
                                    icon={<IconPhoto size={18} />}
                                >
                                    <Card withBorder p="xl" mt="xl" radius="md">
                                        <GeminiImage
                                            api={`${GEMINI_API_BASE}/image`}
                                            prompt={form.fields.image?.alt || `${form.fields.name}, ${form.fields.label}. ${form.fields.definition}`}
                                            autoTrigger={!form.fields.image?.url}
                                        >
                                            {({ result: imgResult, loading: imgLoading, submit: triggerGen, error: imgError }) => {
                                                // Sync Gemini result to form
                                                React.useEffect(() => {
                                                    if (imgResult?.url && form.fields.image?.url !== imgResult.url) {
                                                        form.setField('image', { alt: form.fields.image?.alt || '', url: imgResult.url } as any)
                                                    }
                                                }, [imgResult?.url])

                                                // Error handling
                                                React.useEffect(() => {
                                                    if (imgError) {
                                                        console.error('Gemini Image Error:', imgError)
                                                        notifications.show({
                                                            title: 'Generation Error',
                                                            message: imgError.message.includes('API_KEY') || imgError.message.includes('key') 
                                                                ? 'A paid Gemini API Key is required for high-quality image generation. Check your configuration.' 
                                                                : `Failed to generate image: ${imgError.message}`,
                                                            color: 'red',
                                                            autoClose: 10000,
                                                        })
                                                    }
                                                }, [imgError])

                                                return (
                                                    <Stack gap="xl">
                                                        <Title order={3}>Portrait</Title>

                                                        <Center>
                                                            <Stack align="center" gap="md">
                                                                {imgLoading ? (
                                                                    <Center w={300} h={400} bg="gray.1" style={{ borderRadius: '12px', border: '2px dashed var(--mantine-color-violet-4)' }}>
                                                                        <Stack align="center" gap="xs">
                                                                            <Loader size="lg" color="violet" />
                                                                            <Text size="sm" fw={500} c="violet">Painting your character...</Text>
                                                                        </Stack>
                                                                    </Center>
                                                                ) : (
                                                                    <Image
                                                                        src={form.fields.image?.url || 'https://placehold.co/600x800?text=No+Portrait'}
                                                                        alt={form.fields.image?.alt || ''}
                                                                        radius="md"
                                                                        w={300}
                                                                        h={400}
                                                                        fit="cover"
                                                                        fallbackSrc="https://placehold.co/600x800?text=Error+Loading+Image"
                                                                        style={{
                                                                            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                                                                            border: '1px solid rgba(255,255,255,0.1)'
                                                                        }}
                                                                    />
                                                                )}

                                                                <Group gap="xs">
                                                                    <Button
                                                                        variant="light"
                                                                        color="violet"
                                                                        leftSection={<IconSparkles size={16} />}
                                                                        onClick={async () => {
                                                                            const res = await triggerGen(form.fields.image?.alt || '')
                                                                            if (res?.url) {
                                                                                form.setField('image', { alt: form.fields.image?.alt || '', url: res.url } as any)
                                                                            }
                                                                        }}
                                                                        loading={imgLoading}
                                                                    >
                                                                        Regenerate
                                                                    </Button>

                                                                    <FileButton
                                                                        onChange={(f) => handleUpload(f, form.setField, form.fields.image)}
                                                                        accept="image/png,image/jpeg"
                                                                    >
                                                                        {(props) => (
                                                                            <Button
                                                                                {...props}
                                                                                variant="outline"
                                                                                color="gray"
                                                                                leftSection={<IconUpload size={16} />}
                                                                            >
                                                                                Upload Image
                                                                            </Button>
                                                                        )}
                                                                    </FileButton>
                                                                </Group>
                                                            </Stack>
                                                        </Center>

                                                        <ImageField />

                                                        <Divider />

                                                        <Group justify="space-between">
                                                            <Button variant="subtle" color="gray" onClick={() => setStep(2)}>Back</Button>
                                                            <Button
                                                                color="violet"
                                                                size="lg"
                                                                onClick={form.submit}
                                                                loading={form.loading}
                                                                leftSection={<IconCheck size={18} />}
                                                            >
                                                                Save & Continue →
                                                            </Button>
                                                        </Group>
                                                    </Stack>
                                                )
                                            }}
                                        </GeminiImage>
                                    </Card>
                                </Stepper.Step>

                                <Stepper.Step
                                    label="Review"
                                    description="Share character"
                                    icon={<IconRocket size={18} />}
                                >
                                    <Card withBorder p={0} mt="xl" radius="lg" style={{ background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
                                        {/* Hero header */}
                                        <Stack
                                            align="center"
                                            gap="xs"
                                            py="xl"
                                            px="md"
                                            style={{
                                                background: 'linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%)',
                                            }}
                                        >
                                            <IconSparkles size={40} color="var(--mantine-color-violet-5)" style={{ opacity: 0.7 }} />
                                            <Title order={2} ta="center">Behold, your creation!</Title>
                                            <Text c="dimmed" size="sm">Your character is ready to venture into the world.</Text>
                                        </Stack>

                                        {/* Character preview */}
                                        {createdId && (
                                            <Stack gap="xl" px="xl" pb="xl">
                                                <SingleProvider id={createdId} table="characters" schema={schema}>
                                                    <Card withBorder radius="md" p="lg" style={{ overflow: 'hidden' }}>
                                                        <SingleCharacter />
                                                    </Card>
                                                </SingleProvider>

                                                <Divider label="Share" labelPosition="center" />

                                                <Stack gap="xs">
                                                    <Text size="sm" fw={500} ta="center" c="dimmed">
                                                        Send this link to gift the character:
                                                    </Text>
                                                    <Card withBorder p="md" radius="md" bg="dark.6">
                                                        <Text c='white' size="sm" ta="center" ff="monospace" style={{ wordBreak: 'break-all', letterSpacing: '0.02em' }}>
                                                            {typeof window !== 'undefined' ? window.location.origin : ''}/characters/{createdId}?claim
                                                        </Text>
                                                    </Card>
                                                </Stack>

                                                <Group justify="center" mt="md">
                                                    <Button
                                                        variant="filled"
                                                        color="violet"
                                                        size="lg"
                                                        component="a"
                                                        href={`/characters/${createdId}`}
                                                    >
                                                        See Character
                                                    </Button>

                                                    <Button
                                                        variant="light"
                                                        color="violet"
                                                        size="lg"
                                                        leftSection={<IconSparkles size={18} />}
                                                        onClick={() => {
                                                            setStep(0)
                                                            setIdea('')
                                                            setGenerated(null)
                                                            setCreatedId(null)
                                                        }}
                                                    >
                                                        Create Another
                                                    </Button>
                                                </Group>
                                            </Stack>
                                        )}
                                    </Card>
                                </Stepper.Step>

                                <Stepper.Completed>
                                    <Center py="xl">
                                        <Stack align="center">
                                            <IconCheck size={48} color="green" />
                                            <Text>All steps completed!</Text>
                                            <Button onClick={() => setStep(0)}>Start Over</Button>
                                        </Stack>
                                    </Center>
                                </Stepper.Completed>
                            </Stepper>
                        )}
                    </CreateForm>
                )}
            </Stack>
        </Container>
    )
}
