import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { TW } from "../../common/tailwindMixin";
import { IColorProp } from "../../common/types";

const TwLitElement = TW(LitElement);

export default class HighBaseElement extends TwLitElement {
  // Make localization attributes reactive
  @property() dir: string = "";
  @property() lang: string = "";

  //@property({ reflect: true }) font: "body" | "caption" | "text-sm font-medium";
  @property({ reflect: true }) color: string; // calculate  focus:ring-indigo-500

  // @property({ reflect: true }) shape:
  //   | "square"
  //   | "rounded"
  //   | "circle"
  //   | "rounded-md" = "rounded";
  @property({ reflect: true }) spacing:
    | "compact"
    | "medium"
    | "spacious"
    | "px-4 py-2";

  /** Emits a custom event with more convenient defaults. */
  emit(name: string, options?: CustomEventInit) {
    const event = new CustomEvent(name, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {},
      ...options,
    });

    this.dispatchEvent(event);

    return event;
  }
}
