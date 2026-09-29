import { Injectable } from "@angular/core";
import type { SoparisToastStack, SoparisToastTone } from "./types";

type SoparisToastOptions = {
  tone?: SoparisToastTone;
  title?: string;
  stack?: SoparisToastStack;
  duration?: number;
  dismissible?: boolean;
};

type SoparisThemeVars = {
  primary?: string;
  primaryOn?: string;
  secondary?: string;
  secondarySoft?: string;
  secondaryOn?: string;
  accent?: string;
  accentOn?: string;
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
  premium?: string;
  spaceUnit?: string;
  controlHSm?: string;
  controlHMd?: string;
  controlHLg?: string;
  controlHXl?: string;
  radiusMd?: string;
  [key: string]: string | undefined;
};

type SoparisApi = {
  toast?: (
    message: string,
    tone?: SoparisToastTone | SoparisToastOptions,
    options?: SoparisToastOptions
  ) => void;
  setThemeVars?: (vars: SoparisThemeVars) => void;
  resetThemeVars?: () => void;
  setNavOpen?: (app: Element | null, open: boolean) => void;
  init?: (root?: Document | Element) => void;
};

@Injectable({ providedIn: "root" })
export class SoparisService {
  private get api(): SoparisApi {
    return (globalThis as { Soparis?: SoparisApi }).Soparis ?? {};
  }

  toast(
    message: string,
    toneOrOptions: SoparisToastTone | SoparisToastOptions = "success",
    options: SoparisToastOptions = {}
  ): void {
    this.api.toast?.(message, toneOrOptions, options);
  }

  /** Modo claro/oscuro */
  setColorMode(theme: "light" | "dark"): void {
    document.documentElement.dataset["soparisTheme"] = theme;
    localStorage.setItem("soparis-theme", theme);
  }

  /** @deprecated Usa setColorMode */
  setTheme(theme: "light" | "dark"): void {
    this.setColorMode(theme);
  }

  toggleTheme(): "light" | "dark" {
    const next = document.documentElement.dataset["soparisTheme"] === "dark" ? "light" : "dark";
    this.setColorMode(next);
    return next;
  }

  /** Seeds de color/tamaño (--soparis-theme-*). Ej: setThemeVars({ primary: '#ef4444' }) */
  setThemeVars(vars: SoparisThemeVars): void {
    this.api.setThemeVars?.(vars);
  }

  resetThemeVars(): void {
    this.api.resetThemeVars?.();
  }

  setNavOpen(open: boolean, app = document.querySelector("[data-soparis-app]")): void {
    this.api.setNavOpen?.(app, open);
  }
}
