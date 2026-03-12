import React from 'react'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { ColorSchemeScript, Group, Box, Anchor, Container, Title, Text } from '@mantine/core'
import { GeminiConfig } from '@/components/GeminiConfig'
import { Provider } from '@/components/ui/provider'
import { Auth0Provider } from '@auth0/nextjs-auth0/client'
import AppProviders from './providers'
import { AppHeader } from '@/components/AppHeader'

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
              <AppHeader />
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
