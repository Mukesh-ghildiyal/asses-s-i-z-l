"use client";

import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Text,
  Title,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChartBar,
  IconDashboard,
  IconGauge,
  IconMoon,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Dashboard from "@/components/dashboard";
import LanguageSwitcher from "@/components/language-switcher";

const navItems = [
  { icon: IconDashboard, label: "dashboard" },
  { icon: IconChartBar, label: "analytics" },
  { icon: IconGauge, label: "performance" },
  { icon: IconSettings, label: "settings" },
];

export default function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { t, i18n } = useTranslation();
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [active, setActive] = useState("dashboard");

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLang = localStorage.getItem("i18nextLng");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={3} c="blue">
              Smart Factory
            </Title>
          </Group>
          <Group>
            <LanguageSwitcher />
            <ActionIcon
              variant="default"
              onClick={toggleColorScheme}
              size="lg"
              radius="md"
              aria-label="Toggle color scheme"
            >
              {colorScheme === "dark" ? (
                <IconSun size="1.2rem" />
              ) : (
                <IconMoon size="1.2rem" />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          {navItems.map((item) => (
            <UnstyledButton
              key={item.label}
              onClick={() => setActive(item.label)}
              w="100%"
              py="md"
              px="md"
              style={{
                borderRadius: theme.radius.md,
                backgroundColor:
                  active === item.label ? theme.colors.blue[1] : "transparent",
                color: active === item.label ? theme.colors.blue[6] : undefined,
                marginBottom: 8,
              }}
            >
              <Group>
                <item.icon size="1.2rem" />
                <Text fw={500}>{t(`nav.${item.label}`)}</Text>
              </Group>
            </UnstyledButton>
          ))}
        </AppShell.Section>
        <AppShell.Section>
          <Text size="xs" c="dimmed" ta="center" py="md">
            v1.0.0 © 2025 Smart Factory
          </Text>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Dashboard />
      </AppShell.Main>
    </AppShell>
  );
}
