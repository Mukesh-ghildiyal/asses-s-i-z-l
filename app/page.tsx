"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { I18nextProvider } from "react-i18next"

import AppLayout from "@/components/app-layout"
import i18n from "@/i18n/i18n"

// Create a client
const queryClient = new QueryClient()

export default function Home() {
  // Initialize i18n - removing the initialization here since it should be handled by i18n.ts
  // and we don't want to reset it on every render

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AppLayout />
      </I18nextProvider>
    </QueryClientProvider>
  )
}
