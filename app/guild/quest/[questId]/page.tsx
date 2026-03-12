"use client"

import { Container, Title, Text, Group, Stack, Card, Badge, Button, Grid, Avatar, Divider, Box, Textarea, NumberInput, Paper } from '@mantine/core'
import { IconDeviceFloppy, IconUserPlus, IconSwords, IconClock, IconCoin, IconWand, IconStar } from '@tabler/icons-react'
import { useParams } from 'next/navigation'
import { RpgNavbar } from '@/components/RpgNavbar'

export default function QuestManagementDashboard() {
  const params = useParams()

  const characters = [
    { id: "c1", name: "Aelith Darkbane", img: "https://picsum.photos/seed/aelith/150/150" },
    { id: "c2", name: "Bram Stoutshield", img: "https://picsum.photos/seed/bram/150/150" },
    { id: "c3", name: "Elara Moonwhisper", img: "https://picsum.photos/seed/elara/150/150" }
  ]

  const encounters = [
    { name: "The Gates of Darkness", status: "Resolved" },
    { name: "The Void Terror", status: "Active" },
    { name: "The Archmage's Study", status: "Pending" }
  ]

  return (
    <Box style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', color: '#2c241b' }}>
      <RpgNavbar />
      <Container size="xl" py="xl">
        <Group justify="space-between" mb="xl">
          <Stack gap={4}>
            <Text c="dimmed" tt="uppercase" fw={700} size="xs" style={{ letterSpacing: '1px' }}>Quest Management Dashboard</Text>
            <Title order={1} style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>The Missing Archmage</Title>
          </Stack>
          <Group>
            <Badge size="xl" color="red" variant="outline" style={{ borderColor: '#8b0000', color: '#8b0000' }}>Active Questline</Badge>
            <Button variant="light" color="red" leftSection={<IconUserPlus size={16} />}>Invite Character</Button>
          </Group>
        </Group>

      <Grid gutter="xl">
        {/* Left Column: Overview & Session Resolution */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder radius="md" mb="xl" style={{ backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
            <Group justify="space-between" mb="lg">
              <Title order={3} style={{ fontFamily: 'Georgia, serif', color: '#2c241b' }}>Participating Characters</Title>
            </Group>
            <Group>
              {characters.map(char => (
                <Paper key={char.id} withBorder p="xs" radius="md" style={{ backgroundColor: '#fffdf5', borderColor: '#d4af37' }}>
                  <Group gap="sm">
                    <Avatar src={char.img} radius="xl" />
                    <Text fw={500} size="sm">{char.name}</Text>
                  </Group>
                </Paper>
              ))}
            </Group>
          </Card>

          {/* Lore Wizard / Session Resolution Interface heavily requested */}
          <Card withBorder radius="md" shadow="sm" style={{ backgroundColor: '#fffdf5', borderColor: '#d4af37', borderTopWidth: 4 }}>
            <Group mb="md" gap="xs">
              <IconWand size={20} color="#8b0000" />
              <Title order={3} style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>Session Resolution</Title>
            </Group>
            <Text size="sm" c="dimmed" mb="xl">Write the story of this session to generate the lore record and distribute rewards to all participants.</Text>

            <Stack gap="md">
              <Textarea 
                label="Session Lore" 
                placeholder="What occurred during this part of the questline?"
                minRows={5}
                autosize
                styles={{ input: { backgroundColor: '#fff', borderColor: '#e6dfcc', color: '#2c241b' } }}
              />
              
              <Box p="md" style={{ borderRadius: 8, backgroundColor: '#fff', border: '1px solid #e6dfcc' }}>
                <Title order={5} mb="md" style={{ fontFamily: 'Georgia, serif', color: '#2c241b' }}>Distribute Rewards (Per Character)</Title>
                <Grid>
                  <Grid.Col span={4}>
                    <NumberInput label="Experience" leftSection={<IconStar size={16} />} defaultValue={450} />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <NumberInput label="Gold Pieces" leftSection={<IconCoin size={16} color="gold" />} defaultValue={120} />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <NumberInput label="Downtime Points" leftSection={<IconClock size={16} color="teal" />} defaultValue={2} />
                  </Grid.Col>
                </Grid>
              </Box>

              <Group justify="flex-end" mt="md">
                <Button size="md" color="red" leftSection={<IconDeviceFloppy size={18} />}>Resolve Session & Distribute</Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Right Column: Encounters & Activity */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="xl">
            <Card withBorder radius="md" style={{ backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
              <Group justify="space-between" mb="md">
                <Title order={4} style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>Encounters</Title>
                <Button variant="subtle" color="red" size="xs" leftSection={<IconSwords size={14} />}>New</Button>
              </Group>
              
              <Stack gap="xs">
                {encounters.map((enc, i) => (
                  <Paper key={i} withBorder p="sm" radius="md" style={{ backgroundColor: enc.status === 'Active' ? '#fffdf5' : '#fff', borderColor: enc.status === 'Active' ? '#d4af37' : '#e6dfcc', borderLeftWidth: enc.status === 'Active' ? 4 : 1 }}>
                    <Group justify="space-between">
                      <Text fw={enc.status === 'Active' ? 700 : 500} c={enc.status === 'Active' ? '#8b0000' : '#2c241b'}>{enc.name}</Text>
                      <Badge variant={enc.status === 'Resolved' ? 'outline' : 'filled'} color={enc.status === 'Resolved' ? 'gray' : enc.status === 'Active' ? 'red' : 'yellow'}>
                        {enc.status}
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Card>

            <Card withBorder radius="md" style={{ backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
              <Title order={4} mb="md" style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>Recent Logs</Title>
              <Stack gap="sm">
                <Text size="xs" c="dimmed">1 hour ago</Text>
                <Text size="sm" c="#2c241b">Aelith Darkbane used 'Shadow Dagger'.</Text>
                <Divider color="#e6dfcc" />
                <Text size="xs" c="dimmed">2 hours ago</Text>
                <Text size="sm" c="#2c241b">Bram Stoutshield took 14 damage.</Text>
                <Divider color="#e6dfcc" />
                <Text size="xs" c="dimmed">1 day ago</Text>
                <Text size="sm" c="#2c241b">Session 'The Gates of Darkness' resolved.</Text>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
      </Container>
    </Box>
  )
}
