"use client"

import { Container, Title, Text, Group, Stack, Card, Badge, Button, Grid, Avatar, ThemeIcon, Progress, Box } from '@mantine/core'
import { IconMap, IconUsers, IconSword, IconAlertCircle } from '@tabler/icons-react'
import Link from 'next/link'
import { RpgNavbar } from '@/components/RpgNavbar'

export default function AdventurersGuildHub() {
  const activeQuests = [
    {
      id: "quest-001",
      name: "The Missing Archmage",
      level: "5-7",
      status: "In Progress",
      type: "Investigation",
      participants: 4,
      desc: "Investigate the disappearance of Archmage Valthor from the Ivory Tower."
    },
    {
      id: "quest-002",
      name: "Siege of the Sunken Spire",
      level: "8-10",
      status: "Recruiting",
      type: "Combat",
      participants: 2,
      desc: "Defend the coastal outpost from an emerging Sahuagin threat."
    }
  ]

  const recentActivity = [
    "Aelith Darkbane slew a Void Terror.",
    "Bram Stoutshield crafted a Masterwork Shield.",
    "The party discovered the 'Crown of Thorns'."
  ]

  return (
    <Box style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', color: '#2c241b' }}>
      <RpgNavbar />
      <Container size="lg" py="xl">
        <Group justify="space-between" align="flex-end" mb="xl">
          <Stack gap="xs">
            <Title order={1} style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>Adventurer's Guild</Title>
            <Text c="dimmed">Manage questlines, missions, and the legends of your heroes.</Text>
          </Stack>
          <Button size="md" color="red" leftSection={<IconMap size={18} />}>Post New Mission</Button>
        </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Title order={3} mb="md" style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>Active Questlines (Job Board)</Title>
          <Stack gap="md">
            {activeQuests.map(quest => (
              <Card key={quest.id} withBorder shadow="sm" radius="md" style={{ backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
                <Group justify="space-between" mb="xs">
                  <Group>
                    <ThemeIcon variant="light" size="lg" color={quest.status === 'Recruiting' ? 'yellow' : 'red'}>
                      {quest.type === 'Combat' ? <IconSword size={18} color="#8b0000" /> : <IconMap size={18} color="#c19b22" />}
                    </ThemeIcon>
                    <Title order={4} style={{ fontFamily: 'Georgia, serif', color: '#2c241b' }}>{quest.name}</Title>
                  </Group>
                  <Badge color={quest.status === 'Recruiting' ? 'yellow' : 'red'} variant="outline" style={{ borderColor: quest.status === 'Recruiting' ? '#d4af37' : '#8b0000', color: quest.status === 'Recruiting' ? '#b8860b' : '#8b0000' }}>{quest.status}</Badge>
                </Group>
                
                <Text size="sm" mb="md">{quest.desc}</Text>
                
                <Group justify="space-between">
                  <Group gap="sm">
                    <Badge variant="outline" color="gray" style={{ borderColor: '#e6dfcc', color: '#7a7065' }}>Lv. {quest.level}</Badge>
                    <Group gap={4}>
                      <IconUsers size={14} style={{ color: '#7a7065' }} />
                      <Text size="sm" c="dimmed">{quest.participants} Heroes</Text>
                    </Group>
                  </Group>
                  <Button variant="light" color="red" component={Link} href={`/guild/quest/${quest.id}`}>Manage Quest</Button>
                </Group>
              </Card>
            ))}
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="xl">
            <Card withBorder radius="md" style={{ backgroundColor: '#fffdf5', borderColor: '#d4af37', borderTopWidth: 4 }}>
              <Group mb="md">
                <IconAlertCircle size={20} color="#b8860b" />
                <Title order={4} style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>Guild Master Needs You</Title>
              </Group>
              <Text size="sm" mb="md" c="dimmed">Several characters have unspent downtime points. Remind your players to visit the guild facilities!</Text>
              <Progress value={60} color="yellow" mb="xs" />
              <Text size="xs" ta="center" fw={600} style={{ color: '#b8860b' }}>Guild Treasury: 15,200 gp</Text>
            </Card>

            <Card withBorder radius="md" style={{ backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
              <Title order={4} mb="md" style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>Recent Legends</Title>
              <Stack gap="sm">
                {recentActivity.map((act, i) => (
                  <Box key={i} p="xs" style={{ backgroundColor: '#fdfbf7', borderLeft: '3px solid #d4af37', borderRadius: '0 4px 4px 0' }}>
                    <Text size="sm" c="#2c241b">{act}</Text>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
    </Box>
  )
}
