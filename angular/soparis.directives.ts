import { SoparisButtonDirective } from "./button/button.directive";
import { SoparisCardDirective } from "./card/card.directive";
import { SoparisInputTextDirective } from "./input-text/input-text.directive";

export const SOPARIS_DIRECTIVES = [
  SoparisButtonDirective,
  SoparisInputTextDirective,
  SoparisCardDirective,
] as const;
