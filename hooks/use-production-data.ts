"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Machine, ProductionData } from "@/types/types"
import { generateMockData } from "@/utils/mock-data"

// Simulate API call with a delay
const fetchProductionData = async (): Promise<ProductionData> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate mock data
  const data = generateMockData()

  // Simulate random error (5% chance)
  if (Math.random() < 0.05) {
    throw new Error("Failed to fetch production data")
  }

  return data
}

// Add a new machine (simulated)
interface AddMachineParams {
  name: string
  status: string
  initialOutput: number
}

const addMachine = async (params: AddMachineParams): Promise<Machine> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate random error (10% chance)
  if (Math.random() < 0.1) {
    throw new Error("Failed to add machine")
  }

  // Create a new machine with the provided data
  const newMachine: Machine = {
    id: `machine-${Date.now()}`,
    name: params.name,
    status: params.status,
    totalOutput: params.initialOutput,
    lastUpdated: new Date().toISOString(),
    productionData: [
      {
        date: new Date().toISOString(),
        output: params.initialOutput,
      },
    ],
  }

  return newMachine
}

export const useProductionData = () => {
  return useQuery({
    queryKey: ["productionData"],
    queryFn: fetchProductionData,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 10000, // Consider data fresh for 10 seconds
  })
}

export const useAddMachine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addMachine,
    onSuccess: (newMachine) => {
      // Update the cache with the new machine
      queryClient.setQueryData<ProductionData>(["productionData"], (oldData) => {
        if (!oldData) return { machines: [newMachine], lastUpdated: new Date().toISOString() }

        return {
          ...oldData,
          machines: [...oldData.machines, newMachine],
          lastUpdated: new Date().toISOString(),
        }
      })
    },
  })
}
