import { customElement, property } from "lit/decorators.js";
import HighBaseElement from "../base/base";
import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";

@customElement("high-loader")
export default class HighLoader extends HighBaseElement {
  @property({ reflect: true, type: Boolean }) loading: boolean = false;
  @property({ reflect: true }) speed: "slow" | "medium" | "fast" = "medium";

  render() {
    const overlayClasses = {
      "absolute z-20 h-full w-full bg-gray-500 bg-opacity-25 transition ease-in-out delay-1000":
        true,
      collapse: !this.loading,
    };
    const loaderClasses = {
      "h-full flex items-center justify-center": true,
    };
    const spinnerClasses = {
      "-ml-1 mr-3 h-10 w-10 text-white animate-spin-medium": true,
      "animate-spin-fast": this.speed === "fast",
      "animate-spin-slow": this.speed === "slow",
    };

    return html`<div class=${classMap(overlayClasses)}>
      <div class=${classMap(loaderClasses)}>
        <svg
          class=${classMap(spinnerClasses)}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "high-loader": HighLoader;
  }
}
