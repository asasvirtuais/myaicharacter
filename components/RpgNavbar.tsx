"use client"

import { Box, Container, Group, Anchor, Title, Text, Button } from '@mantine/core'
import { IconMap, IconUsers, IconSword } from '@tabler/icons-react'
import Link from 'next/link'

export function RpgNavbar() {
  return (
    <Box component="header" py="sm" style={{ 
      backgroundColor: '#f6f1e3', // Parchment color
      borderBottom: '2px solid #8b0000', // Crimson red border
      boxShadow: '0 4px 6px -1px rgba(139, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 10
    }}>
      <Container size="xl">
        <Group justify="space-between">
          <Anchor component={Link} href="/guild" underline="never" c="inherit">
            <Group gap="xs">
              <IconSword size={26} color="#8b0000" />
              <Title order={3} style={{ fontFamily: 'Georgia, serif', color: '#8b0000', letterSpacing: '1px' }}>
                Adventurer's Guild
              </Title>
            </Group>
          </Anchor>
          <Group gap="md">
            <Button component={Link} href="/guild" variant="subtle" color="red" style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>
              Job Board
            </Button>
            <Button component={Link} href="/characters/c1/sheet" variant="subtle" color="red" style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>
              My Character
            </Button>
          </Group>
        </Group>
      </Container>
    </Box>
  )
}
