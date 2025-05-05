"use client"

import { useMantineColorScheme, useMantineTheme } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import type { Machine } from "@/types/types"
import { aggregateProductionData } from "@/utils/data-utils"

interface ProductionChartProps {
  data: Machine[]
  dateRange: [Date, Date]
}

export default function ProductionChart({ data, dateRange }: ProductionChartProps) {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === "dark"

  // Aggregate data by day for the chart
  const chartData = aggregateProductionData(data, dateRange)

  // Define chart colors based on theme
  const colors = [
    theme.colors.blue[isDark ? 5 : 6],
    theme.colors.teal[isDark ? 5 : 6],
    theme.colors.violet[isDark ? 5 : 6],
    theme.colors.pink[isDark ? 5 : 6],
    theme.colors.orange[isDark ? 5 : 6],
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          {data.map((machine, index) => (
            <linearGradient key={machine.id} id={`color-${machine.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#eee"} />
        <XAxis dataKey="date" stroke={isDark ? theme.colors.gray[5] : theme.colors.gray[7]} tick={{ fontSize: 12 }} />
        <YAxis stroke={isDark ? theme.colors.gray[5] : theme.colors.gray[7]} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
            borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[3],
            color: isDark ? theme.white : theme.black,
          }}
        />
        <Legend />
        {data.map((machine, index) => (
          <Area
            key={machine.id}
            type="monotone"
            dataKey={machine.id}
            name={machine.name}
            stroke={colors[index % colors.length]}
            fillOpacity={1}
            fill={`url(#color-${machine.id})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
