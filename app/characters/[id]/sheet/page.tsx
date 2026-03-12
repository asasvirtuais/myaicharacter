"use client"

import { Container, Paper, Title, Text, Badge, Group, Stack, Avatar, Tabs, Grid, Card, Image, ThemeIcon, Divider, SimpleGrid, RingProgress, Button, ActionIcon, Box } from '@mantine/core'
import { IconShield, IconHeart, IconSword, IconWand, IconBook, IconCoin, IconClock, IconMap, IconStar, IconBackpack } from '@tabler/icons-react'
import { useParams } from 'next/navigation'
import { RpgNavbar } from '@/components/RpgNavbar'

export default function EpicCharacterSheetPage() {
  const params = useParams()
  
  // Mock data
  const character = {
    name: "Aelith Darkbane",
    label: "Shadowblade Commando",
    level: 7,
    className: "Rogue / Warlock",
    race: "Half-Elf",
    alignment: "Chaotic Neutral",
    hp: { current: 58, max: 63 },
    ac: 16,
    speed: 35,
    proficiency: 3,
    exp: { current: 23000, next: 34000 },
    stats: {
      str: { score: 10, mod: 0 },
      dex: { score: 18, mod: +4 },
      con: { score: 14, mod: +2 },
      int: { score: 12, mod: +1 },
      wis: { score: 10, mod: 0 },
      cha: { score: 16, mod: +3 },
    },
    image: "https://picsum.photos/seed/aelith/800/800"
  }

  const epicRecords = [
    {
      questId: "quest-001",
      questName: "The Missing Archmage",
      status: "Completed",
      records: [
        { title: "Bargain with the Imp", image: "https://picsum.photos/seed/lore1/600/400", desc: "Aelith made a treacherous pact to navigate the obsidian mazes." },
        { title: "Slaying the Void Terror", image: "https://picsum.photos/seed/lore2/600/400", desc: "The final blow was struck with a dagger cloaked in absolute darkness." }
      ]
    },
    {
      questId: "quest-002",
      questName: "Siege of the Sunken Spire",
      status: "Active",
      records: [
        { title: "Ambush at High Tide", image: "https://picsum.photos/seed/lore3/600/400", desc: "The party was cornered by sahuagin before they even breached the gates." }
      ]
    }
  ]

  return (
    <Box style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', color: '#2c241b' }}>
      <RpgNavbar />
      <Container size="xl" py="xl">
        {/* Header Profile Section */}
        <Paper p="xl" radius="md" mb="xl" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#fffdf5', border: '1px solid #d4af37', boxShadow: '0 4px 12px rgba(139, 0, 0, 0.05)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: `url(${character.image})`, backgroundSize: 'cover', filter: 'blur(20px)' }} />
        
        <Box pos="relative" style={{ zIndex: 1 }}>
          <Grid>
          <Grid.Col span={{ base: 12, md: 'auto' }}>
            <Group wrap="nowrap" align="flex-start">
              <Avatar src={character.image} size={150} radius="md" style={{ border: '3px solid var(--mantine-color-dark-4)' }} />
              <Stack gap="xs">
                <Title order={1} style={{ fontFamily: 'Georgia, serif' }}>{character.name}</Title>
                <Group gap="sm">
                  <Badge size="lg" variant="dot" color="violet">{character.label}</Badge>
                  <Text size="sm" c="dimmed">{character.race} • {character.className}</Text>
                  <Text size="sm" c="dimmed">Align: {character.alignment}</Text>
                </Group>
                
                <Group mt="md" gap="xl">
                  <Stack gap={0} align="center">
                    <ThemeIcon size="xl" radius="md" color="red" variant="light">
                      <IconHeart size={24} color="#8b0000" />
                    </ThemeIcon>
                    <Text fw={700} mt={4} c="#8b0000">{character.hp.current} / {character.hp.max}</Text>
                    <Text size="xs" c="dimmed">Hit Points</Text>
                  </Stack>
                  <Stack gap={0} align="center">
                    <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                      <IconShield size={24} />
                    </ThemeIcon>
                    <Text fw={700} mt={4}>{character.ac}</Text>
                    <Text size="xs" c="dimmed">Armor Class</Text>
                  </Stack>
                  <Stack gap={0} align="center">
                    <ThemeIcon size="xl" radius="md" variant="light" color="indigo">
                      <IconSword size={24} />
                    </ThemeIcon>
                    <Text fw={700} mt={4}>+{character.proficiency}</Text>
                    <Text size="xs" c="dimmed">Proficiency</Text>
                  </Stack>
                </Group>

              </Stack>
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <Stack align="center" justify="center" h="100%">
              <RingProgress
                size={120}
                thickness={8}
                roundCaps
                sections={[{ value: (character.exp.current / character.exp.next) * 100, color: 'grape' }]}
                label={
                  <Text fw={700} ta="center" size="xl">
                    Lv {character.level}
                  </Text>
                }
              />
              <Text size="xs" c="dimmed" ta="center">{character.exp.current} / {character.exp.next} XP</Text>
            </Stack>
          </Grid.Col>
        </Grid>
        </Box>
      </Paper>

      {/* Main Content Tabs */}
      <Tabs defaultValue="sheet" variant="outline" radius="md">
        <Tabs.List mb="md">
          <Tabs.Tab value="sheet" leftSection={<IconBook size={16} />}>Character Sheet</Tabs.Tab>
          <Tabs.Tab value="inventory" leftSection={<IconBackpack size={16} />}>Inventory & Trade</Tabs.Tab>
          <Tabs.Tab value="downtime" leftSection={<IconClock size={16} />}>Downtime</Tabs.Tab>
          <Tabs.Tab value="chronicle" leftSection={<IconMap size={16} />}>Chronicle</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="sheet">
          <Grid>
            {/* Stats Column */}
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Stack gap="sm">
                {Object.entries(character.stats).map(([stat, val]) => (
                  <Paper key={stat} withBorder p="sm" radius="md" ta="center" style={{ backgroundColor: '#fff', borderColor: '#e6dfcc', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <Text tt="uppercase" size="xs" fw={800} c="dimmed" style={{ letterSpacing: '2px' }}>{stat}</Text>
                    <Title order={2} style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>{val.score}</Title>
                    <Badge variant="outline" color={val.mod >= 0 ? 'yellow' : 'red'} style={{ fontFamily: 'monospace', borderColor: '#d4af37', color: '#c19b22' }}>{val.mod >= 0 ? '+' : ''}{val.mod}</Badge>
                  </Paper>
                ))}
              </Stack>
            </Grid.Col>
            
            {/* Main Sheet Column */}
            <Grid.Col span={{ base: 12, md: 9 }}>
              <Paper withBorder p="md" radius="md" style={{ backgroundColor: '#fffdf5', borderColor: '#e6dfcc' }}>
                <Title order={3} mb="md" style={{ fontFamily: 'Georgia, serif', color: '#8b0000', borderBottom: '1px solid #e6dfcc', paddingBottom: '8px' }}>Spells & Attacks</Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Card withBorder style={{ backgroundColor: '#fff', borderColor: '#e6dfcc', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <Group justify="space-between">
                      <Group gap="sm">
                        <ThemeIcon color="gray" variant="light"><IconSword size={16} /></ThemeIcon>
                        <Text fw={500}>Shadow Dagger</Text>
                      </Group>
                      <Badge>+7 to hit</Badge>
                    </Group>
                    <Text size="sm" mt="sm">1d4 + 4 piercing + 2d6 sneak attack.</Text>
                  </Card>
                  <Card withBorder style={{ backgroundColor: '#fff', borderColor: '#e6dfcc', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <Group justify="space-between">
                      <Group gap="sm">
                        <ThemeIcon color="violet" variant="light"><IconWand size={16} /></ThemeIcon>
                        <Text fw={500}>Eldritch Blast</Text>
                      </Group>
                      <Badge>+6 to hit</Badge>
                    </Group>
                    <Text size="sm" mt="sm">1d10 + 3 force damage. Two beams.</Text>
                  </Card>
                </SimpleGrid>

                <Title order={3} mt="xl" mb="md" style={{ fontFamily: 'Georgia, serif', color: '#8b0000', borderBottom: '1px solid #e6dfcc', paddingBottom: '8px' }}>Features & Traits</Title>
                <Stack gap="xs">
                  <Paper p="sm" style={{ backgroundColor: '#fff', borderLeft: '4px solid #8b0000', borderColor: '#e6dfcc' }}>
                    <Text fw={600} size="sm" c="#2c241b" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>Devil's Sight</Text>
                    <Text size="sm" c="dimmed" mt={4}>You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.</Text>
                  </Paper>
                  <Paper p="sm" style={{ backgroundColor: '#fff', borderLeft: '4px solid #d4af37', borderColor: '#e6dfcc' }}>
                    <Text fw={600} size="sm" c="#2c241b" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>Cunning Action</Text>
                    <Text size="sm" c="dimmed" mt={4}>You can take a bonus action on each of your turns in combat to Dash, Disengage, or Hide.</Text>
                  </Paper>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="inventory">
          <Paper withBorder p="xl" radius="md" style={{ backgroundColor: '#fffdf5', borderColor: '#e6dfcc' }}>
            <Group justify="space-between" mb="xl">
              <Title order={3} style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>Inventory & Wealth</Title>
              <Group>
                <Paper withBorder p="xs" radius="md">
                  <Group gap="xs">
                    <IconCoin color="gold" size={20} />
                    <Text fw={700}>1,450 gp</Text>
                  </Group>
                </Paper>
                <Button variant="light" leftSection={<IconCoin size={16} />}>Log Transaction</Button>
              </Group>
            </Group>
            <SimpleGrid cols={{ base: 1, md: 3 }}>
              {["Cloak of Elvenkind", "Bag of Holding", "Potion of Healing (x3)", "Thieves' Tools", "Dungeoneer's Pack"].map(item => (
                <Card key={item} withBorder padding="sm" style={{ backgroundColor: '#fff', borderColor: '#e6dfcc', borderLeft: '3px solid #d4af37' }}>
                  <Text fw={500} style={{ fontFamily: 'Georgia, serif', color: '#2c241b' }}>{item}</Text>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="downtime">
          <Paper withBorder p="xl" radius="md" style={{ backgroundColor: '#fffdf5', borderColor: '#e6dfcc' }}>
             <Group justify="space-between" mb="xl">
              <Title order={3} style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>Downtime Activities</Title>
              <Group>
                <Badge size="xl" color="teal">14 Downtime Points</Badge>
                <Button variant="light" color="teal" leftSection={<IconClock size={16} />}>Spend Points</Button>
              </Group>
            </Group>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card withBorder style={{ backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
                  <Title order={5} style={{ fontFamily: 'Georgia, serif', color: '#2c241b' }}>Crafting Magic Items</Title>
                  <Text size="sm" c="dimmed" mt="xs" mb="md">Spend downtime points and gold to craft an item.</Text>
                  <Button variant="outline" color="red" fullWidth>Craft Item</Button>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card withBorder style={{ backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
                  <Title order={5} style={{ fontFamily: 'Georgia, serif', color: '#2c241b' }}>Training</Title>
                  <Text size="sm" c="dimmed" mt="xs" mb="md">Gain new proficiencies or languages over time.</Text>
                  <Button variant="outline" color="red" fullWidth>Start Training</Button>
                </Card>
              </Grid.Col>
            </Grid>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="chronicle">
          <Paper withBorder p="xl" radius="md" style={{ backgroundColor: '#fffdf5', borderColor: '#d4af37', borderTopWidth: 4 }}>
            <Title order={2} mb="xl" ta="center" style={{ fontFamily: 'Georgia, serif', color: '#8b0000', letterSpacing: '2px', textTransform: 'uppercase' }}>The Epic Chronicle</Title>

            <Stack gap="xl">
              {epicRecords.map(quest => (
                <Box key={quest.questId}>
                  <Group justify="space-between" mb="md">
                    <Group>
                      <ThemeIcon size="lg" radius="xl" color={quest.status === 'Active' ? 'red' : 'gray'} variant="light">
                        <IconStar size={18} color={quest.status === 'Active' ? '#8b0000' : 'gray'} />
                      </ThemeIcon>
                      <Title order={3} style={{ fontFamily: 'Georgia, serif', color: '#2c241b' }}>{quest.questName}</Title>
                    </Group>
                    <Badge color={quest.status === 'Active' ? 'yellow' : 'gray'} variant="outline" style={{ color: quest.status === 'Active' ? '#d4af37' : 'gray', borderColor: quest.status === 'Active' ? '#d4af37' : 'gray' }}>{quest.status}</Badge>
                  </Group>

                  <Grid>
                    {quest.records.map((record, idx) => (
                      <Grid.Col span={{ base: 12, md: 6 }} key={idx}>
                        <Card p={0} radius="md" withBorder style={{ backgroundColor: '#fff', borderColor: '#e6dfcc' }}>
                          <Image src={record.image} height={200} alt={record.title} style={{ borderBottom: '2px solid #8b0000' }} />
                          <Box p="md">
                            <Title order={5} mb="xs" style={{ fontFamily: 'Georgia, serif', color: '#8b0000' }}>{record.title}</Title>
                            <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>{record.desc}</Text>
                          </Box>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                  <Divider my="xl" />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
      </Container>
    </Box>
  )
}
