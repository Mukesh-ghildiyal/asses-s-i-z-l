"use client"

import { Button, Group, Modal, NumberInput, Select, Stack, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useAddMachine } from "@/hooks/use-production-data"

interface AddMachineFormProps {
  opened: boolean
  onClose: () => void
}

export default function AddMachineForm({ opened, onClose }: AddMachineFormProps) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addMachine = useAddMachine()

  const form = useForm({
    initialValues: {
      name: "",
      status: "online",
      initialOutput: 0,
    },
    validate: {
      name: (value) => (value.trim().length < 3 ? t("form.errors.nameRequired") : null),
      initialOutput: (value) => (value < 0 ? t("form.errors.positiveNumber") : null),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true)
    try {
      await addMachine.mutateAsync({
        name: values.name,
        status: values.status,
        initialOutput: values.initialOutput,
      })

      notifications.show({
        title: t("notifications.success"),
        message: t("notifications.machineAdded"),
        color: "green",
        icon: <IconCheck size="1.1rem" />,
      })

      form.reset()
      onClose()
    } catch (error) {
      notifications.show({
        title: t("notifications.error"),
        message: (error as Error).message || t("notifications.unknownError"),
        color: "red",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title={t("form.addMachine")} centered size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label={t("form.machineName")}
            placeholder={t("form.machineNamePlaceholder")}
            required
            {...form.getInputProps("name")}
          />

          <Select
            label={t("form.status")}
            placeholder={t("form.selectStatus")}
            data={[
              { value: "online", label: t("status.online") },
              { value: "offline", label: t("status.offline") },
              { value: "maintenance", label: t("status.maintenance") },
            ]}
            required
            {...form.getInputProps("status")}
          />

          <NumberInput
            label={t("form.initialOutput")}
            placeholder={t("form.initialOutputPlaceholder")}
            min={0}
            {...form.getInputProps("initialOutput")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose} disabled={isSubmitting}>
              {t("actions.cancel")}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("actions.add")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
