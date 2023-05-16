import { IStringStringObj } from "@/components/dataTable/dataTable";
import { IColorProp } from "../types";

export class ParseColor {
  private templates = {
    background: ["background-color: rgb({rgb} / var(--tw-bg-opacity))"],
    text: ["color: var(--color-{color})"],
    ring: [
      "--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
      "--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--color-{color})",
      "box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)",
    ],
  };

  generateInlineColors(color: IColorProp) {
    if (color === null) return {};

    let inline: IStringStringObj = {};
    if (Object.getOwnPropertyNames(color).includes("background")) {
      inline.background = "";
      const root = getComputedStyle(document.documentElement);
      const bgColor = root.getPropertyValue("--color-" + color.background);
      const rgb = hex2rgb(bgColor);
      this.templates.background.forEach((e) => {
        inline.background += e.replace(/{rgb}/g, rgb.join(" ")) + ";";
      });
    }
    if (Object.getOwnPropertyNames(color).includes("text")) {
      inline.text = "";
      this.templates.text.forEach((e) => {
        inline.text += e.replace(/{color}/g, color.text) + ";";
      });
    }
    if (Object.getOwnPropertyNames(color).includes("ring")) {
      inline.ring = "";
      this.templates.ring.forEach((e) => {
        inline.ring += e.replace(/{color}/g, color.ring) + ";";
      });
    }
    return inline;
  }
}

export function getContrastForegroundColor(rgb = [0, 0, 0]) {
  var sum = Math.round((rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000);
  return sum > 134 ? "black" : "white";
}
export function hex2rgb(hex: string) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // return {r, g, b}
  return [r, g, b];
}
