import { Directive, ElementRef, HostBinding, Input, inject } from "@angular/core";
import type { SoparisSize } from "../types";

@Directive({
  selector: "input[soparisInputText], textarea[soparisInputText], select[soparisInputText]",
  standalone: true,
})
export class SoparisInputTextDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Input() size: SoparisSize = "md";
  @Input() invalid = false;

  @HostBinding("class")
  get hostClass(): string {
    const tag = this.el.nativeElement.tagName;
    const base =
      tag === "TEXTAREA" ? "soparis-input-textarea" : tag === "SELECT" ? "soparis-input-select" : "soparis-input-text";
    return [
      base,
      `${base}--${this.size}`,
      this.invalid ? `${base}--error` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }
}
