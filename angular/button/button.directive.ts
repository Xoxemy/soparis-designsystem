import { Directive, HostBinding, Input } from "@angular/core";
import type { SoparisButtonVariant, SoparisSize } from "../types";

@Directive({
  selector: "button[soparisButton], a[soparisButton]",
  standalone: true,
})
export class SoparisButtonDirective {
  @Input() soparisButton: SoparisButtonVariant | "" = "primary";
  @Input() size: SoparisSize = "md";
  @Input() block = false;

  @HostBinding("class")
  get hostClass(): string {
    const variant = this.soparisButton || "primary";
    return [
      "soparis-button",
      `soparis-button--${variant}`,
      `soparis-button--${this.size}`,
      this.block ? "soparis-button--block" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }
}
