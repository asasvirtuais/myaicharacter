'use client'

import React, { useState, useEffect } from 'react'
import { ActionIcon, Modal, TextInput, Stack, Button, Group, Text, Box } from '@mantine/core'
import { IconSettings, IconKey, IconCheck } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

export function GeminiConfig() {
    const [opened, setOpened] = useState(false)
    const [key, setKey] = useState('')
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const storedKey = localStorage.getItem('GEMINI_API_KEY')
        if (storedKey) {
            setKey(storedKey)
            setSaved(true)
        }
    }, [])

    const handleSave = () => {
        localStorage.setItem('GEMINI_API_KEY', key)
        setSaved(!!key)
        notifications.show({
            title: key ? 'API Key Saved' : 'API Key Removed',
            message: key ? 'Your Gemini API Key has been stored locally.' : 'Gemini will use the system default key.',
            color: key ? 'green' : 'blue',
        })
        setOpened(false)
    }

    return (
        <>
            <ActionIcon 
                variant="subtle" 
                color={saved ? "violet" : "gray"} 
                size="lg" 
                onClick={() => setOpened(true)}
                title="Gemini Configuration"
            >
                <IconSettings size={22} stroke={1.5} />
            </ActionIcon>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={<Group gap="xs"><IconKey size={18} /><Text fw={500}>Gemini Configuration</Text></Group>}
                centered
            >
                <Stack>
                    <Text size="sm" c="dimmed">
                        Configure your personal Gemini API Key for generations. This key is stored only in your browser's local storage.
                    </Text>
                    <TextInput
                        label="Gemini API Key"
                        placeholder="AIzaSy..."
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        type="password"
                    />
                    <Group justify="flex-end" mt="md">
                        <Button variant="subtle" color="gray" onClick={() => setOpened(false)}>Cancel</Button>
                        <Button color="violet" onClick={handleSave} leftSection={saved && !key ? null : <IconCheck size={16} />}>
                            {saved && !key ? 'Clear Key' : 'Save Configuration'}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    )
}
