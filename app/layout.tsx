import React from 'react'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { ColorSchemeScript, Group, Box, Anchor, Container, Title, Text } from '@mantine/core'
import { GeminiConfig } from '@/components/GeminiConfig'
import { Provider } from '@/components/ui/provider'
import { Auth0Provider } from '@auth0/nextjs-auth0/client'
import AppProviders from './providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <Auth0Provider>
          <Provider>
            <AppProviders>
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
              <Box component="main">
                {children}
              </Box>
            </AppProviders>
          </Provider>
        </Auth0Provider>
      </body>
    </html>
  )
}
