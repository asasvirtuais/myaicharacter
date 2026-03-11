'use client'
import React, { use } from 'react'
import { Container, Title, Text, Stack, Center, Card } from '@mantine/core'
import { SingleProvider, useSingle } from 'asasvirtuais/react-interface'
import { schema, type Character } from '@/app/characters'

function ChatPlaceholder() {
    const { single } = useSingle('characters', schema) as { single: Character | null }

    return (
        <Container size="sm" py="xl">
            <Stack align="center" gap="lg">
                <Title order={1} style={{ letterSpacing: '-0.02em' }}>
                    Chat
                </Title>
                <Card withBorder p="xl" radius="md" w="100%">
                    <Center py="xl">
                        <Stack align="center" gap="sm">
                            <Text size="3rem">💬</Text>
                            <Title order={3} c="dimmed">
                                Chat with {single?.name || 'Character'}
                            </Title>
                            <Text c="dimmed" size="sm" ta="center" maw={300}>
                                This feature is coming soon.
                            </Text>
                        </Stack>
                    </Center>
                </Card>
            </Stack>
        </Container>
    )
}

export default function ChatPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)

    return (
        <SingleProvider id={id} table="characters" schema={schema}>
            <ChatPlaceholder />
        </SingleProvider>
    )
}
