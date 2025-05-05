"use client"

import type { Machine } from "@/types/types"

// Format date as YYYY-MM-DD
export const formatDateForChart = (date: Date): string => {
  return date.toISOString().split("T")[0]
}

// Check if a date is within a range
export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate
}

// Aggregate production data by day for the chart
export const aggregateProductionData = (machines: Machine[], dateRange: [Date, Date]) => {
  if (!machines.length || !dateRange[0] || !dateRange[1]) return []

  const [startDate, endDate] = dateRange
  const result: Record<string, any>[] = []

  // Create a map of dates in the range
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dateStr = formatDateForChart(currentDate)
    const dataPoint: Record<string, any> = { date: dateStr }

    // Initialize with zero for each machine
    machines.forEach((machine) => {
      dataPoint[machine.id] = 0
    })

    result.push(dataPoint)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Fill in the actual data
  machines.forEach((machine) => {
    machine.productionData.forEach((entry) => {
      const entryDate = new Date(entry.date)
      if (isDateInRange(entryDate, startDate, endDate)) {
        const dateStr = formatDateForChart(entryDate)
        const dataPoint = result.find((item) => item.date === dateStr)
        if (dataPoint) {
          dataPoint[machine.id] += entry.output
        }
      }
    })
  })

  return result
}
