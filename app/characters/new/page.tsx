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

import { GeminiObject, GeminiImage } from 'asasvirtuais-gemini'

const GEMINI_API_BASE = 'https://asasvirtuais.dev/api/gemini'

export default function NewCharacterPage() {
    const [step, setStep] = useState(0)
    const [idea, setIdea] = useState('')
    const [generated, setGenerated] = useState<Writable | null>(null)
    const [createdId, setCreatedId] = useState<string | null>(null)

    return (
        <Container size="sm" py="xl">
            <Stack gap="lg">
                <Title order={1} ta="center" style={{ letterSpacing: '-0.02em' }}>
                    Create a Character
                </Title>

                <Stepper active={step} onStepClick={setStep} size="sm" color="violet">
                    {/* Step 0: Idea */}
                    <Stepper.Step label="Idea" description="Describe your character">
                        <GeminiObject<Writable>
                            api={`${GEMINI_API_BASE}/object`}
                            schema={schema.writable}
                            instructions="Generate a complete character record based on the user's idea. The output must follow the schema provided. Be creative and detailed in the 'details' field. 'notes' should be an array of short, interesting facts or attributes."
                        >
                            {({ submit, object, isLoading }) => (
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
                                            <Button
                                                color="violet"
                                                loading={isLoading}
                                                onClick={async () => {
                                                    const result = await submit(idea)
                                                    if (result) {
                                                        setGenerated(result)
                                                        setStep(1)
                                                    }
                                                }}
                                                disabled={!idea.trim() || isLoading}
                                            >
                                                ✦ Generate Character
                                            </Button>
                                        </Group>
                                    </Stack>
                                </Card>
                            )}
                        </GeminiObject>
                    </Stepper.Step>

                    {/* Step 1: Review & Save */}
                    <Stepper.Step label="Review" description="Edit & save">
                        {generated && (
                            <Card withBorder p="lg" mt="md" radius="md">
                                <GeminiImage
                                    api={`${GEMINI_API_BASE}/image`}
                                    prompt={generated.image?.alt || `Portrait of ${generated.name}, ${generated.label}. ${generated.definition}`}
                                    autoTrigger
                                >
                                    {({ result: imageResult, loading: imageLoading, submit: regenerateImage }) => (
                                        <CreateForm
                                            table="characters"
                                            schema={schema}
                                            defaults={{
                                                ...generated,
                                                image: {
                                                    alt: generated.image?.alt || '',
                                                    url: imageResult?.url || generated.image?.url || '',
                                                }
                                            } as any}
                                            onSuccess={(character: any) => {
                                                setCreatedId(character.id)
                                                setStep(2)
                                            }}
                                        >
                                            {(form) => (
                                                <Stack gap="md">
                                                    <Center>
                                                        <Stack align="center" gap="xs">
                                                            {imageLoading ? (
                                                                <Center w={200} h={267} bg="gray.1" style={{ borderRadius: '8px' }}>
                                                                    <Loader size="sm" />
                                                                </Center>
                                                            ) : (
                                                                <Image
                                                                    src={form.fields.image?.url || 'https://placehold.co/400x533?text=Generating...'}
                                                                    alt={form.fields.image?.alt}
                                                                    radius="md"
                                                                    w={200}
                                                                    h={267}
                                                                    fit="cover"
                                                                    style={{
                                                                        boxShadow: '0 4px 20px rgba(128, 90, 213, 0.15)',
                                                                    }}
                                                                />
                                                            )}
                                                            <Button
                                                                variant="subtle"
                                                                size="compact-xs"
                                                                color="violet"
                                                                loading={imageLoading}
                                                                onClick={() => regenerateImage(form.fields.image?.alt || '')}
                                                            >
                                                                Regenerate Image
                                                            </Button>
                                                        </Stack>
                                                    </Center>
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
                                    )}
                                </GeminiImage>
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
