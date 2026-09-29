import { Directive, HostBinding, Input } from "@angular/core";
import type { SoparisCardVariant, SoparisSize } from "../types";

@Directive({
  selector: "[soparisCard]",
  standalone: true,
})
export class SoparisCardDirective {
  @Input() soparisCard: SoparisSize | "" = "md";
  @Input() variant: SoparisCardVariant = "default";

  @HostBinding("class")
  get hostClass(): string {
    const size = this.soparisCard || "md";
    const variant = this.variant !== "default" ? `soparis-card--${this.variant}` : "";
    return ["soparis-card", `soparis-card--${size}`, variant].filter(Boolean).join(" ");
  }
}
