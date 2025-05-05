"use client"

import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Paper,
  Progress,
  RingProgress,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useDisclosure } from "@mantine/hooks"
import {
  IconAlertTriangle,
  IconCheck,
  IconCloudUpload,
  IconDeviceDesktop,
  IconDeviceDesktopAnalytics,
  IconGauge,
  IconRefresh,
  IconSettings,
  IconTools,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { useProductionData } from "@/hooks/use-production-data"
import type { Machine } from "@/types/types"

import AddMachineForm from "./add-machine-form"
import ProductionChart from "./production-chart"
import ProductionTable from "./production-table"
import StatsCard from "./stats-card"

export default function Dashboard() {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [opened, { open, close }] = useDisclosure(false)

  // Get the current date and 7 days ago for default date range
  useEffect(() => {
    const today = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)
    setDateRange([sevenDaysAgo, today])
  }, [])

  // Fetch production data
  const { data: productionData, isLoading, isError, error, refetch, isFetching } = useProductionData()

  // Extract unique machine names for the select input
  const machineOptions =
    productionData?.machines.map((machine: Machine) => ({
      value: machine.id,
      label: machine.name,
    })) || []

  // Filter data based on selected machine
  const filteredData = selectedMachine
    ? productionData?.machines.filter((machine: Machine) => machine.id === selectedMachine)
    : productionData?.machines || []

  // Calculate stats
  const totalMachines = filteredData.length
  const onlineMachines = filteredData.filter((m) => m.status.toLowerCase() === "online").length
  const totalProduction = filteredData.reduce((sum, machine) => sum + machine.totalOutput, 0)
  const efficiency = totalMachines > 0 ? (onlineMachines / totalMachines) * 100 : 0

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <Title order={1}>{t("pageTitle")}</Title>
        <Group>
          <Button
            leftSection={<IconRefresh size="1rem" />}
            variant="light"
            onClick={() => refetch()}
            loading={isFetching && !isLoading}
          >
            {t("actions.refresh")}
          </Button>
          <Button onClick={open}>{t("actions.addMachine")}</Button>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
        <StatsCard
          title={t("stats.totalMachines")}
          value={totalMachines.toString()}
          icon={<IconDeviceDesktop size="1.8rem" stroke={1.5} />}
          color="blue"
        />
        <StatsCard
          title={t("stats.onlineMachines")}
          value={`${onlineMachines}/${totalMachines}`}
          icon={<IconCheck size="1.8rem" stroke={1.5} />}
          color="teal"
        />
        <StatsCard
          title={t("stats.totalProduction")}
          value={totalProduction.toLocaleString()}
          icon={<IconCloudUpload size="1.8rem" stroke={1.5} />}
          color="blue"
        />
        <StatsCard
          title={t("stats.efficiency")}
          value={`${efficiency.toFixed(1)}%`}
          icon={<IconGauge size="1.8rem" stroke={1.5} />}
          color="violet"
        />
      </SimpleGrid>

      <Paper shadow="sm" p="md" mb="lg" radius="md" withBorder>
        <Group align="flex-end">
          <Select
            label={t("machineNameLabel")}
            placeholder={t("selectMachinePlaceholder")}
            data={machineOptions}
            value={selectedMachine}
            onChange={setSelectedMachine}
            clearable
            style={{ minWidth: 200 }}
          />
          <DatePickerInput
            type="range"
            label={t("dateRangeLabel")}
            placeholder={t("selectDateRangePlaceholder")}
            value={dateRange}
            onChange={setDateRange}
            mx="auto"
            style={{ minWidth: 300 }}
          />
        </Group>
      </Paper>

      {isLoading ? (
        <Stack>
          <Paper p="md" withBorder radius="md">
            <Group mb="md" position="apart">
              <Skeleton height={30} width={200} radius="md" />
              <Skeleton height={24} width={100} radius="md" />
            </Group>
            <Skeleton height={300} radius="md" />
          </Paper>
          <Paper p="md" withBorder radius="md">
            <Skeleton height={30} width={200} mb="md" radius="md" />
            <Skeleton height={400} radius="md" />
          </Paper>
        </Stack>
      ) : isError ? (
        <Paper p="md" bg="red.1" color="red.8" radius="md" withBorder>
          <Group>
            <ThemeIcon color="red" size="lg" radius="xl">
              <IconAlertTriangle size="1.2rem" />
            </ThemeIcon>
            <Text fw={500}>
              {t("errorLoading")}: {(error as Error).message}
            </Text>
          </Group>
          <Button mt="md" variant="outline" color="red" onClick={() => refetch()}>
            {t("actions.tryAgain")}
          </Button>
        </Paper>
      ) : (
        <>
          <Grid gutter="md" mb="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <Card.Section withBorder inheritPadding py="xs" mb="md">
                  <Group justify="space-between">
                    <Title order={3}>{t("productionChartTitle")}</Title>
                    <Badge color="blue" variant="light">
                      {t("lastDays", { days: 7 })}
                    </Badge>
                  </Group>
                </Card.Section>
                <ProductionChart data={filteredData} dateRange={dateRange as [Date, Date]} />
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <Card.Section withBorder inheritPadding py="xs" mb="md">
                  <Title order={3}>{t("stats.machineStatus")}</Title>
                </Card.Section>
                <Stack align="center" justify="center" h="calc(100% - 60px)">
                  <RingProgress
                    size={180}
                    thickness={16}
                    roundCaps
                    sections={[
                      {
                        value:
                          (filteredData.filter((m) => m.status.toLowerCase() === "online").length / totalMachines) *
                          100,
                        color: "green",
                      },
                      {
                        value:
                          (filteredData.filter((m) => m.status.toLowerCase() === "maintenance").length /
                            totalMachines) *
                          100,
                        color: "yellow",
                      },
                      {
                        value:
                          (filteredData.filter((m) => m.status.toLowerCase() === "offline").length / totalMachines) *
                          100,
                        color: "red",
                      },
                    ]}
                    label={
                      <Text ta="center" fw={700} size="xl">
                        {onlineMachines}
                        <Text size="sm" c="dimmed" component="span">
                          {t("stats.online")}
                        </Text>
                      </Text>
                    }
                  />
                  <Group mt="md">
                    <Group gap="xs">
                      <Box w={12} h={12} bg="green" style={{ borderRadius: "50%" }} />
                      <Text size="sm">{t("status.online")}</Text>
                    </Group>
                    <Group gap="xs">
                      <Box w={12} h={12} bg="yellow" style={{ borderRadius: "50%" }} />
                      <Text size="sm">{t("status.maintenance")}</Text>
                    </Group>
                    <Group gap="xs">
                      <Box w={12} h={12} bg="red" style={{ borderRadius: "50%" }} />
                      <Text size="sm">{t("status.offline")}</Text>
                    </Group>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
            <Card.Section withBorder inheritPadding py="xs" mb="md">
              <Title order={3}>{t("productionTableTitle")}</Title>
            </Card.Section>
            <ProductionTable data={filteredData} />
          </Card>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            {filteredData.slice(0, 3).map((machine) => (
              <Card key={machine.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Text fw={500}>{machine.name}</Text>
                  <Badge
                    color={
                      machine.status.toLowerCase() === "online"
                        ? "green"
                        : machine.status.toLowerCase() === "maintenance"
                          ? "yellow"
                          : "red"
                    }
                  >
                    {t(`status.${machine.status.toLowerCase()}`)}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" mb="md">
                  {t("stats.outputProgress")}
                </Text>

                <Progress
                  value={(machine.totalOutput / 1000) * 100}
                  color={
                    machine.status.toLowerCase() === "online"
                      ? "green"
                      : machine.status.toLowerCase() === "maintenance"
                        ? "yellow"
                        : "red"
                  }
                  size="lg"
                  radius="md"
                  mb="md"
                />

                <Group justify="space-between">
                  <Text size="sm">{t("stats.totalOutput")}</Text>
                  <Text size="sm" fw={500}>
                    {machine.totalOutput.toLocaleString()}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm">{t("stats.lastUpdated")}</Text>
                  <Text size="sm" fw={500}>
                    {new Date(machine.lastUpdated).toLocaleString()}
                  </Text>
                </Group>

                <Group mt="md" justify="space-between">
                  <ThemeIcon
                    size="md"
                    radius="md"
                    variant="light"
                    color={
                      machine.status.toLowerCase() === "online"
                        ? "green"
                        : machine.status.toLowerCase() === "maintenance"
                          ? "yellow"
                          : "red"
                    }
                  >
                    {machine.status.toLowerCase() === "online" ? (
                      <IconDeviceDesktopAnalytics size="1rem" />
                    ) : machine.status.toLowerCase() === "maintenance" ? (
                      <IconTools size="1rem" />
                    ) : (
                      <IconSettings size="1rem" />
                    )}
                  </ThemeIcon>
                  <Badge variant="outline">ID: {machine.id}</Badge>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </>
      )}

      <AddMachineForm opened={opened} onClose={close} />
    </Container>
  )
}
