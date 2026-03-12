"use client"

import { Box, Container, Group, Anchor, Title, Text } from '@mantine/core'
import { GeminiConfig } from '@/components/GeminiConfig'
import { usePathname } from 'next/navigation'

export function AppHeader() {
  const pathname = usePathname()
  
  // Hide this standard header on RPG simulation pages
  if (pathname?.includes('/guild') || pathname?.includes('/sheet')) {
    return null
  }

  return (
    <Box component="header" py="md" style={{ borderBottom: '1px solid var(--mantine-color-dark-4)' }}>
      <Container size="lg">
        <Group justify="space-between">
          <Anchor href="/" underline="never" c="inherit">
            <Title order={3} style={{ letterSpacing: '-0.02em' }}>
              Chronicle <Text component="span" c="violet" inherit>AI</Text>
            </Title>
          </Anchor>
          <Group gap="md">
            <Anchor href="/characters/new" size="sm" fw={500} visibleFrom="xs">Create Character</Anchor>
            <GeminiConfig />
          </Group>
        </Group>
      </Container>
    </Box>
  )
}
