export interface ProductionEntry {
  date: string
  output: number
}

export interface Machine {
  id: string
  name: string
  status: string
  totalOutput: number
  lastUpdated: string
  productionData: ProductionEntry[]
}

export interface ProductionData {
  machines: Machine[]
  lastUpdated: string
}
