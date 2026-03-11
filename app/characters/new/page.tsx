'use client'
import React, { useState } from 'react'
import {
    Container,
    Title,
    Text,
    Stack,
    Stepper,
    Button,
    Group,
    Card,
    Image,
    Badge,
    Divider,
    Loader,
    Center,
    Textarea,
} from '@mantine/core'
import {
    NameField,
    LabelField,
    DefinitionField,
    DetailsField,
    NotesField,
    ImageField,
} from 'asasvirtuais-characters/fields'
import { CreateForm } from 'asasvirtuais/react-interface'
import { schema } from '@/app/characters'
import type { Writable } from 'asasvirtuais-characters'

// Mock AI generation — will be replaced with real Gemini call
async function mockGenerate(idea: string): Promise<Writable> {
    await new Promise(r => setTimeout(r, 1500))
    const name = idea.split(' ').slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Unnamed'
    return {
        name,
        label: 'The Wanderer',
        definition: `A mysterious figure born from the idea: "${idea.slice(0, 60)}..."`,
        details: `${name} walks the thin edge between worlds.\n\nBorn under a crimson sky, they carry the weight of prophecy. Their journey began in the borderlands where reality thins and ancient powers seep through the cracks. Known among travelers as a figure of both hope and dread, they walk the line between light and shadow with practiced ease.\n\nPersonality: Calm under pressure, fiercely loyal, with a dry wit that surfaces in the worst moments. Struggles with trust but will protect allies without hesitation.\n\nBackground: Raised by a traveling merchant who found them abandoned at a crossroads. Trained in both blade and word, equally dangerous in a tavern brawl and a royal court.`,
        notes: [
            'Carries a sealed letter — never opened',
            'Left eye glows faintly in darkness',
            'Allergic to healing potions',
            'Speaks an unknown dialect in sleep',
            'Wanted in two provinces',
        ],
        image: {
            alt: `Portrait of ${name}, a wandering figure. Fantasy character portrait, dramatic lighting, painterly style.`,
            url: `https://placehold.co/400x533/2a1a3a/e0c0ff?text=${encodeURIComponent(name)}`,
        },
    }
}

export default function NewCharacterPage() {
    const [step, setStep] = useState(0)
    const [idea, setIdea] = useState('')
    const [generated, setGenerated] = useState<Writable | null>(null)
    const [generating, setGenerating] = useState(false)
    const [createdId, setCreatedId] = useState<string | null>(null)

    async function handleGenerate() {
        setGenerating(true)
        const result = await mockGenerate(idea)
        setGenerated(result)
        setGenerating(false)
        setStep(1)
    }

    return (
        <Container size="sm" py="xl">
            <Stack gap="lg">
                <Title order={1} ta="center" style={{ letterSpacing: '-0.02em' }}>
                    Create a Character
                </Title>

                <Stepper active={step} onStepClick={setStep} size="sm" color="violet">
                    {/* Step 0: Idea */}
                    <Stepper.Step label="Idea" description="Describe your character">
                        <Card withBorder p="lg" mt="md" radius="md">
                            <Stack gap="md">
                                <Text c="dimmed" size="sm">
                                    Tell me about the character you have in mind. A sentence, a vibe, a full backstory — whatever you have.
                                </Text>
                                <Textarea
                                    placeholder="A blind oracle who trades prophecies for memories..."
                                    minRows={4}
                                    autosize
                                    maxRows={8}
                                    value={idea}
                                    onChange={e => setIdea(e.target.value)}
                                    styles={{
                                        input: { fontSize: '1rem', lineHeight: 1.6 },
                                    }}
                                />
                                <Group justify="flex-end">
                                    {generating ? (
                                        <Button color="violet" loading>
                                            Generating...
                                        </Button>
                                    ) : (
                                        <Button
                                            color="violet"
                                            onClick={handleGenerate}
                                            disabled={!idea.trim()}
                                        >
                                            ✦ Generate Character
                                        </Button>
                                    )}
                                </Group>
                            </Stack>
                        </Card>
                    </Stepper.Step>

                    {/* Step 1: Review & Save */}
                    <Stepper.Step label="Review" description="Edit & save">
                        {generated && (
                            <Card withBorder p="lg" mt="md" radius="md">
                                <CreateForm
                                    table="characters"
                                    schema={schema}
                                    defaults={generated as any}
                                    onSuccess={(character: any) => {
                                        setCreatedId(character.id)
                                        setStep(2)
                                    }}
                                >
                                    {(form: any) => (
                                        <Stack gap="md">
                                            {generated.image?.url && (
                                                <Center>
                                                    <Image
                                                        src={generated.image.url}
                                                        alt={generated.image.alt}
                                                        radius="md"
                                                        w={200}
                                                        h={267}
                                                        fit="cover"
                                                        style={{
                                                            boxShadow: '0 4px 20px rgba(128, 90, 213, 0.15)',
                                                        }}
                                                    />
                                                </Center>
                                            )}
                                            <NameField />
                                            <LabelField />
                                            <DefinitionField />
                                            <DetailsField />
                                            <NotesField />
                                            <ImageField />
                                            <Divider />
                                            <Group justify="space-between">
                                                <Button
                                                    variant="subtle"
                                                    color="gray"
                                                    onClick={() => setStep(0)}
                                                >
                                                    ← Back to idea
                                                </Button>
                                                <Button
                                                    color="violet"
                                                    onClick={form.submit}
                                                    loading={form.loading}
                                                >
                                                    Save Character
                                                </Button>
                                            </Group>
                                        </Stack>
                                    )}
                                </CreateForm>
                            </Card>
                        )}
                    </Stepper.Step>

                    <Stepper.Completed>
                        <Card withBorder p="xl" mt="md" radius="md">
                            <Stack align="center" gap="md">
                                <Text size="3rem">✦</Text>
                                <Title order={2}>Character Created</Title>
                                <Text c="dimmed" ta="center">
                                    Share this link to gift the character:
                                </Text>
                                {createdId && (
                                    <Card withBorder p="sm" radius="sm" w="100%" bg="dark.6">
                                        <Text size="sm" ta="center" ff="monospace" style={{ wordBreak: 'break-all' }}>
                                            {typeof window !== 'undefined' ? window.location.origin : ''}/characters/{createdId}?claim
                                        </Text>
                                    </Card>
                                )}
                                <Group>
                                    {createdId && (
                                        <Button
                                            component="a"
                                            href={`/characters/${createdId}`}
                                            color="violet"
                                        >
                                            View Character
                                        </Button>
                                    )}
                                    <Button
                                        variant="light"
                                        color="violet"
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
                        </Card>
                    </Stepper.Completed>
                </Stepper>
            </Stack>
        </Container>
    )
}
