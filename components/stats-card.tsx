"use client"

import { Card, Group, Text, ThemeIcon, useMantineTheme } from "@mantine/core"
import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string
  icon: ReactNode
  color: string
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const theme = useMantineTheme()

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="xl" mt="xs">
            {value}
          </Text>
        </div>
        <ThemeIcon color={color} variant="light" size="xl" radius="md">
          {icon}
        </ThemeIcon>
      </Group>
    </Card>
  )
}
