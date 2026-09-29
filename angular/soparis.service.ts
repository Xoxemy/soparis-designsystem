import { Injectable } from "@angular/core";
import type { SoparisToastStack } from "./types";

type SoparisApi = {
  toast?: (message: string, tone?: string | { tone?: string; stack?: SoparisToastStack }, options?: { stack?: SoparisToastStack }) => void;
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
    tone: "info" | "success" = "success",
    stack: SoparisToastStack = "up"
  ): void {
    this.api.toast?.(message, tone, { stack });
  }

  setTheme(theme: "light" | "dark"): void {
    document.documentElement.dataset["soparisTheme"] = theme;
    localStorage.setItem("soparis-theme", theme);
  }

  toggleTheme(): "light" | "dark" {
    const next = document.documentElement.dataset["soparisTheme"] === "dark" ? "light" : "dark";
    this.setTheme(next);
    return next;
  }

  setNavOpen(open: boolean, app = document.querySelector("[data-soparis-app]")): void {
    this.api.setNavOpen?.(app, open);
  }
}
