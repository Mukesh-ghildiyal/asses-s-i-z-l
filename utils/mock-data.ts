"use client"

import type { Machine, ProductionData, ProductionEntry } from "@/types/types"

// Generate random production entries for the past 30 days
const generateProductionEntries = (
  startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
): ProductionEntry[] => {
  const entries: ProductionEntry[] = []
  const endDate = new Date()

  // Create an entry for each day
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    entries.push({
      date: new Date(currentDate).toISOString(),
      output: Math.floor(Math.random() * 100) + 50, // Random output between 50-150
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return entries
}

// Generate random machine data
const generateMachines = (count = 5): Machine[] => {
  const statusOptions = ["Online", "Offline", "Maintenance"]
  const machines: Machine[] = []

  for (let i = 1; i <= count; i++) {
    const productionData = generateProductionEntries()
    const totalOutput = productionData.reduce((sum, entry) => sum + entry.output, 0)

    machines.push({
      id: `machine-${i}`,
      name: `Machine ${i}`,
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      totalOutput,
      lastUpdated: new Date().toISOString(),
      productionData,
    })
  }

  return machines
}

// Generate complete mock data
export const generateMockData = (): ProductionData => {
  return {
    machines: generateMachines(),
    lastUpdated: new Date().toISOString(),
  }
}
