"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { GlassFilter } from "@/components/ui/liquid-radio";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Theme = "light" | "dark" | "system";

interface ThemeSwitcherProps {
  defaultValue?: Theme;
  value?: Theme;
  onValueChange?: (theme: Theme) => void;
}

interface ThemeOption {
  value: Theme;
  label: string;
  icon: LucideIcon;
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ThemeSwitcher({
  defaultValue = "light",
  value,
  onValueChange,
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [internalValue, setInternalValue] = useState<Theme>(value ?? defaultValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeValue: Theme = (value ?? theme ?? internalValue) as Theme;

  const handleValueChange = (next: string) => {
    const nextTheme = next as Theme;

    if (onValueChange) {
      onValueChange(nextTheme);
      return;
    }

    setTheme(nextTheme);
    setInternalValue(nextTheme);
  };

  // Render placeholder on server and until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <fieldset className="liquid-toggle__fieldset" aria-hidden="true">
        <legend className="liquid-toggle__legend">Choose theme</legend>
        <GlassFilter />
        <div className="liquid-toggle liquid-toggle--static">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.value}
                className="liquid-toggle__item liquid-toggle__item--placeholder"
              >
                <span className="liquid-toggle__glow" aria-hidden="true" />
                <Icon className="liquid-toggle__icon" aria-hidden="true" />
                <span className="sr-only">{option.label}</span>
              </div>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset className="liquid-toggle__fieldset">
      <legend className="liquid-toggle__legend">Choose theme</legend>
      <GlassFilter />
      <RadioGroup
        value={activeValue}
        onValueChange={handleValueChange}
        className="liquid-toggle"
        aria-label="Theme"
      >
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;

          return (
            <RadioGroupItem
              key={option.value}
              id={`theme-${option.value}`}
              value={option.value}
              className="liquid-toggle__item border-transparent shadow-none focus-visible:outline-none focus-visible:ring-0"
              unstyled
              indicator={false}
            >
              <span className="liquid-toggle__glow" aria-hidden="true" />
              <Icon className="liquid-toggle__icon" aria-hidden="true" />
              <span className="sr-only">{option.label}</span>
            </RadioGroupItem>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}