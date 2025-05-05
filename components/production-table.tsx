"use client"

import { Badge, Group, Table, Text, ThemeIcon } from "@mantine/core"
import { IconArrowDown, IconArrowUp, IconMinus } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"

import type { Machine } from "@/types/types"

interface ProductionTableProps {
  data: Machine[]
}

export default function ProductionTable({ data }: ProductionTableProps) {
  const { t } = useTranslation()

  // Function to determine status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "green"
      case "offline":
        return "red"
      case "maintenance":
        return "yellow"
      default:
        return "gray"
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Calculate trend (mock data for demonstration)
  const getTrend = (machine: Machine) => {
    const random = Math.random()
    if (random > 0.6) return "up"
    if (random > 0.3) return "down"
    return "neutral"
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t("tableMachineName")}</Table.Th>
          <Table.Th>{t("tableStatus")}</Table.Th>
          <Table.Th>{t("tableOutput")}</Table.Th>
          <Table.Th>{t("stats.trend")}</Table.Th>
          <Table.Th>{t("tableLastUpdated")}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((machine) => {
          const trend = getTrend(machine)
          return (
            <Table.Tr key={machine.id}>
              <Table.Td>
                <Text fw={500}>{machine.name}</Text>
              </Table.Td>
              <Table.Td>
                <Badge color={getStatusColor(machine.status)} variant="filled">
                  {t(`status.${machine.status.toLowerCase()}`)}
                </Badge>
              </Table.Td>
              <Table.Td>{machine.totalOutput.toLocaleString()}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {trend === "up" ? (
                    <ThemeIcon color="teal" variant="light" size="sm" radius="xl">
                      <IconArrowUp size="1rem" stroke={1.5} />
                    </ThemeIcon>
                  ) : trend === "down" ? (
                    <ThemeIcon color="red" variant="light" size="sm" radius="xl">
                      <IconArrowDown size="1rem" stroke={1.5} />
                    </ThemeIcon>
                  ) : (
                    <ThemeIcon color="gray" variant="light" size="sm" radius="xl">
                      <IconMinus size="1rem" stroke={1.5} />
                    </ThemeIcon>
                  )}
                  <Text size="sm" c={trend === "up" ? "teal" : trend === "down" ? "red" : "dimmed"}>
                    {trend === "up"
                      ? `+${Math.floor(Math.random() * 10) + 1}%`
                      : trend === "down"
                        ? `-${Math.floor(Math.random() * 10) + 1}%`
                        : "0%"}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td>{formatDate(machine.lastUpdated)}</Table.Td>
            </Table.Tr>
          )
        })}
      </Table.Tbody>
    </Table>
  )
}
