'use client';

import {
  Title,
  Text,
  Container,
  SimpleGrid,
  Card,
  ThemeIcon,
  rem,
  useMantineTheme,
  Stack,
  Group,
  Badge,
  Button,
  Box,
} from '@mantine/core';
import {
  HiDevicePhoneMobile,
  HiFire,
  HiSquares2X2,
  HiPaintBrush,
  HiBolt,
  HiGlobeAlt,
  HiArrowRight,
} from 'react-icons/hi2';

const features = [
  {
    title: 'Ready to use components',
    description: '100+ high-quality components with many variations and props for every use case.',
    icon: HiSquares2X2,
    color: 'blue',
  },
  {
    title: 'Highly customizable',
    description: 'Extensible theme system with colors, fonts, spacing and other tokens.',
    icon: HiPaintBrush,
    color: 'grape',
  },
  {
    title: 'Performance first',
    description: 'Minimal bundle size, zero runtime injection, and high performance components.',
    icon: HiFire,
    color: 'orange',
  },
  {
    title: 'Responsive by default',
    description: 'Built-in support for responsive layouts with intuitive props and hooks.',
    icon: HiDevicePhoneMobile,
    color: 'teal',
  },
  {
    title: 'Type safe',
    description: 'First class TypeScript support for every component and hook.',
    icon: HiBolt,
    color: 'yellow',
  },
  {
    title: 'Accessibility',
    description: 'Every component follows WAI-ARIA standards and is accessible for everyone.',
    icon: HiGlobeAlt,
    color: 'indigo',
  },
];

export default function Home() {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: `radial-gradient(circle at top right, ${theme.colors.violet[9]} 0%, ${theme.black} 40%), 
                    radial-gradient(circle at bottom left, ${theme.colors.indigo[9]} 0%, ${theme.black} 40%)`,
        paddingTop: rem(80),
        paddingBottom: rem(80),
      }}
    >
      <Container size="lg">
        <Stack align="center" gap="md" mb={rem(60)}>
          <Badge
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan' }}
            size="lg"
            radius="sm"
          >
            Mantine Framework
          </Badge>
          <Title
            order={1}
            style={{
              fontSize: rem(52),
              fontWeight: 900,
              textAlign: 'center',
              color: theme.white,
              letterSpacing: rem(-1),
            }}
          >
            Why we use Mantine
          </Title>
          <Text
            c="dimmed"
            size="xl"
            ta="center"
            maw={600}
            mx="auto"
            style={{ lineHeight: 1.6 }}
          >
            The ultimate library for building functional, accessible and beautiful web applications with React.
          </Text>
          <Group justify="center" mt="xl">
            <Button
              size="lg"
              variant="gradient"
              gradient={{ from: 'violet', to: 'indigo' }}
              rightSection={<HiArrowRight size={20} />}
              radius="md"
            >
              Get Started
            </Button>
            <Button size="lg" variant="default" radius="md">
              Documentation
            </Button>
          </Group>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl" verticalSpacing="xl">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              shadow="md"
              radius="lg"
              padding="xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = theme.colors.violet[6];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <ThemeIcon
                size={rem(50)}
                radius="md"
                variant="gradient"
                gradient={{ from: feature.color, to: 'indigo' }}
                mb="md"
              >
                <feature.icon size={rem(26)} strokeWidth={2} />
              </ThemeIcon>
              <Text size="lg" fw={700} c="white" mb="sm">
                {feature.title}
              </Text>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>

        <Box
          mt={100}
          p={60}
          style={{
            background: `linear-gradient(135deg, ${theme.colors.violet[9]} 0%, ${theme.colors.indigo[9]} 100%)`,
            borderRadius: theme.radius.xl,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 250,
              height: 250,
              background: 'white',
              opacity: 0.1,
              borderRadius: '50%',
              filter: 'blur(50px)',
            }}
          />
          <Stack align="center" gap="lg" style={{ position: 'relative', zIndex: 1 }}>
            <Title order={2} c="white" ta="center">
              Build your next project with speed and style
            </Title>
            <Text c="white" opacity={0.8} ta="center" maw={700}>
              Join thousands of developers who are already building amazing applications with Mantine.
              The most complete components library for your Next.js applications.
            </Text>
            <Button size="xl" color="white" variant="white" c="violet" radius="xl" px={40}>
              Start Building Now
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
