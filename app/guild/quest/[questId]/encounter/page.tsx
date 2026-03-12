"use client"

import { Container, Paper, Title, Text, Group, Stack, Badge, Button, Image, Box, ActionIcon, SimpleGrid, Card } from '@mantine/core'
import { IconArrowLeft, IconSword, IconShield, IconWand, IconRun } from '@tabler/icons-react'
import Link from 'next/link'
import { RpgNavbar } from '@/components/RpgNavbar'

export default function PlayerEncounterActionArea() {
  const encounterImage = "https://picsum.photos/seed/encounter/1200/400"
  
  return (
    <Box style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', color: '#2c241b' }}>
      <RpgNavbar />
      <Container size="md" py="xl">
        <Group mb="xl">
          <ActionIcon component={Link} href="/characters/c1/sheet" variant="subtle" color="red" size="lg">
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Stack gap={0}>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} style={{ letterSpacing: '1px' }}>Active Encounter</Text>
            <Title order={3} style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>The Void Terror's Lair</Title>
          </Stack>
        </Group>

      <Paper radius="md" withBorder p={0} style={{ overflow: 'hidden', backgroundColor: '#fff', borderColor: '#d4af37', borderTopWidth: 4 }} mb="xl">
        <Image src={encounterImage} height={300} alt="The Void Terror" />
        <Box p="xl">
          <Badge color="red" mb="sm" variant="dot">Immediate Threat</Badge>
          <Title order={2} mb="md" style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>The Eye Opens</Title>
          <Text size="lg" lh={1.6} c="#2c241b">
            The sprawling ruin shakes as a massive, obsidian tendril bursts through the paving stones. 
            Before you, the Void Terror focuses its singular, glowing eye toward your party. 
            The air grows cold, and reality itself seems to warp around its form. It is preparing to strike.
          </Text>
          <Text mt="md" fw={600} style={{ color: '#8b0000' }}>What is your immediate action, Aelith?</Text>
        </Box>
      </Paper>

      <Title order={4} mb="md" style={{ fontFamily: 'Georgia, serif', color: '#2c241b' }}>Choose Your Action</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Card withBorder radius="md" style={{ cursor: 'pointer', backgroundColor: '#fff', borderColor: '#e6dfcc', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
          <Group align="flex-start">
            <ActionIcon variant="light" color="red" size="xl" radius="md">
              <IconSword size={24} color="#8b0000" />
            </ActionIcon>
            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={5} style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>Shadow Strike</Title>
              <Text size="sm" c="dimmed">Rush forward using the debris as cover, targeting the creature's eye with your dagger.</Text>
            </Stack>
          </Group>
        </Card>

        <Card withBorder radius="md" style={{ cursor: 'pointer', backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
          <Group align="flex-start">
            <ActionIcon variant="light" color="violet" size="xl" radius="md">
              <IconWand size={24} color="#5e35b1" />
            </ActionIcon>
            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={5} style={{ fontFamily: 'Georgia, serif', color: '#5e35b1' }}>Eldritch Blast</Title>
              <Text size="sm" c="dimmed">Keep your distance and fire two beams of force energy at the tendrils.</Text>
            </Stack>
          </Group>
        </Card>

        <Card withBorder radius="md" style={{ cursor: 'pointer', backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
          <Group align="flex-start">
            <ActionIcon variant="light" color="blue" size="xl" radius="md">
              <IconShield size={24} color="#1971c2" />
            </ActionIcon>
            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={5} style={{ fontFamily: 'Georgia, serif', color: '#1971c2' }}>Defensive Stance</Title>
              <Text size="sm" c="dimmed">Prepare to dodge the incoming attack and brace for impact.</Text>
            </Stack>
          </Group>
        </Card>

        <Card withBorder radius="md" style={{ cursor: 'pointer', backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
          <Group align="flex-start">
            <ActionIcon variant="light" color="gray" size="xl" radius="md" style={{ backgroundColor: '#e6dfcc' }}>
              <IconRun size={24} color="#2c241b" />
            </ActionIcon>
            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={5} style={{ fontFamily: 'Georgia, serif', color: '#2c241b' }}>Flee to Higher Ground</Title>
              <Text size="sm" c="dimmed">Use Cunning Action to disengage and climb the ruined pillars for a better vantage point.</Text>
            </Stack>
          </Group>
        </Card>
      </SimpleGrid>

      <Group justify="flex-end" mt="xl">
        <Button size="lg" color="red" rightSection={<IconSword size={18} />}>Commit Action</Button>
      </Group>

      </Container>
    </Box>
  )
}
