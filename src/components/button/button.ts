import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { html, PropertyValues } from "lit";
import HighBaseElement from "../base/base";
import {
  ParseColor,
  getContrastForegroundColor,
  hex2rgb,
} from "../../common/utilities/color";
import { IStringStringObj } from "../dataTable/dataTable";
import { IColorProp } from "@/common/types";

/**
 * A custom element that fires event on value change.
 *
 * @element high-button
 *
 * @prop {string} value - Value of the component
 * @fires {CustomEvent} value-changed - Event fired when value is changed
 */

@customElement("high-button")
export default class HighButton extends HighBaseElement {
  private readonly commonStyles =
    "inline-flex items-center border shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 px-4 py-2 text-sm font-medium border-gray-100";

  @property({ reflect: true }) icon: "{name, size, prefix, suffix}";
  //background, text, placeholder, border, border.disabled, background.disabled

  // @state() private hasFocus = false;

  /** The button's size. */
  // @property({ reflect: true }) size: "small" | "medium" | "large" = "medium";

  /** Disables the button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Draws the button in a loading state. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /**
   * The type of button. When the type is `submit`, the button will submit the surrounding form. Note that the default
   * value is `button` instead of `submit`, which is opposite of how native `<button>` elements behave.
   */
  @property() type: "button" | "submit" | "reset" = "button";

  /** An optional name for the button. */
  @property() name?: string;

  /** An optional value for the button. */
  @property() value?: string;

  @property({ type: Function }) onClick?: Function;

  /**
   * The "form owner" to associate the button with. If omitted, the closest containing form will be used instead. The
   * value of this attribute must be an id of a form in the same document or shadow root as the button.
   */
  @property() form: string;

  /** Used to override the form owner's `action` attribute. */
  @property({ attribute: "formaction" }) formAction: string;

  /** Used to override the form owner's `method` attribute.  */
  @property({ attribute: "formmethod" }) formMethod: "post" | "get";

  /** Used to override the form owner's `novalidate` attribute. */
  @property({ attribute: "formnovalidate", type: Boolean })
  formNoValidate: boolean;

  /** Used to override the form owner's `target` attribute. */
  @property({ attribute: "formtarget" }) formTarget:
    | "_self"
    | "_blank"
    | "_parent"
    | "_top"
    | string;

  private inline: IStringStringObj = {};

  willUpdate(changedProperties: PropertyValues<this>) {
    // only need to check changed properties for an expensive computation.
    const parser = new ParseColor();
    if (changedProperties.has("color")) {
      const root = getComputedStyle(document.documentElement);
      const backgroundColor = root.getPropertyValue("--color-" + this.color);
      const text = getContrastForegroundColor(hex2rgb(backgroundColor));

      this.inline = parser.generateInlineColors({
        background: this.color,
        text: text,
      } as IColorProp);
    }
  }

  render() {
    const classes = {
      "rounded-md bg-opacity-100": true,
      hidden: this.hidden,
      [this.commonStyles]: this.commonStyles,
      "disabled:opacity-75": this.disabled,
    };

    return html`<button
      part="base"
      @click=${this.onClick}
      style="${this.inline.background}${this.inline.text}"
      class=${classMap(classes)}
      ?disabled=${this.disabled}
    >
      <slot></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "high-button": HighButton;
  }
}
