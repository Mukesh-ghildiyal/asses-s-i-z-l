"use client"

import { Button, Popover, Stack, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconChevronDown, IconLanguage } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const [currentLang, setCurrentLang] = useState(i18n.language)
  const [opened, { toggle, close }] = useDisclosure(false)

  // Update the current language state when i18n.language changes
  useEffect(() => {
    setCurrentLang(i18n.language)
  }, [i18n.language])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      setCurrentLang(lng)
      // Save to localStorage to persist the language choice
      localStorage.setItem("i18nextLng", lng)
      close() // Close the popover after selection
    })
  }

  // Get language display name
  const getLanguageDisplay = (code: string) => {
    switch (code) {
      case "en":
        return "English"
      case "ko":
        return "한국어"
      default:
        return code
    }
  }

  return (
    <Popover opened={opened} onChange={toggle} position="bottom-end" withArrow shadow="md">
      <Popover.Target>
        <Button
          onClick={toggle}
          variant="default"
          rightSection={<IconChevronDown size="1rem" />}
          leftSection={<IconLanguage size="1rem" />}
          size="sm"
        >
          {getLanguageDisplay(currentLang)}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
          <Text size="sm" fw={600} c="dimmed">
            Select Language
          </Text>
          <Button
            variant={currentLang === "en" ? "light" : "subtle"}
            leftSection={<span style={{ fontSize: "1.2rem" }}>🇺🇸</span>}
            onClick={() => changeLanguage("en")}
            fullWidth
            justify="flex-start"
            size="sm"
          >
            English
          </Button>
          <Button
            variant={currentLang === "ko" ? "light" : "subtle"}
            leftSection={<span style={{ fontSize: "1.2rem" }}>🇰🇷</span>}
            onClick={() => changeLanguage("ko")}
            fullWidth
            justify="flex-start"
            size="sm"
          >
            한국어
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
