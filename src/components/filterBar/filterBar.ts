import { customElement, property, state } from "lit/decorators.js";
import HighBaseElement from "../base/base";
import { html, PropertyValues } from "lit";
import { classMap } from "lit/directives/class-map.js";

import {
  IDataTableHeader,
  IDataTableConfig,
  IStringStringObj,
} from "../dataTable/dataTable";
import "../calendar/calendar";
import { map } from "lit/directives/map.js";
import { IColorProp } from "../../common/types";
import { ParseColor } from "../../common/utilities/color";

@customElement("high-filter-bar")
export default class HighFilterBar extends HighBaseElement {
  @property({ type: Array }) headers: IDataTableHeader[];
  @property({ type: Array }) data: IStringStringObj[];
  @property({ type: Object }) config: IDataTableConfig;

  constructor() {
    super();
    window.addEventListener("click", () => (this.clicked = ""));
  }

  get filters() {
    return this.headers.filter(
      (header) => !header.hasOwnProperty("filter") || header.filter !== false
    );
  }
  @state() clicked = "";
  private _handleClick(e: Event, value: string) {
    e.stopPropagation();
    this.clicked = this.clicked === value ? "" : value;
  }

  buttonTemplate(label: string, value: string) {
    const filterClasses = {
      "inline-flex items-center rounded border border-transparent px-2.5 py-1.5 text-xs font-medium text-black bg-opacity-25 hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-alternate focus:ring-offset-2 mr-2":
        true,
    };
    return html`<button
      type="button"
      class=${classMap(filterClasses)}
      style=${this.inline.background}
      @click=${(e: Event) => this._handleClick(e, value)}
    >
      ${label}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>`;
  }
  getFilterForm(type: string | undefined) {
    if (type === "date") return html`<high-calendar></high-calendar>`;
    if (type === "number") return html`Number eq, lt, gt`;
    return html`String search multiselect`;
  }
  filterMenuTemplate(filter: IDataTableHeader) {
    const menuClasses = {
      "absolute top-8 left-0 z-10 mt-4 w-96 p-4 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none":
        true,
      hidden: this.clicked !== filter.data.value,
    };
    return html`<div
      class=${classMap(menuClasses)}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        ${this.getFilterForm(filter.data.type)}
      </div>
    </div>`;
  }

  private inline: IStringStringObj = {};

  willUpdate(changedProperties: PropertyValues<this>) {
    // only need to check changed properties for an expensive computation.
    const parser = new ParseColor();

    if (changedProperties.has("color")) {
      this.inline = parser.generateInlineColors({
        background: this.color,
      } as IColorProp);
    }
  }

  render() {
    const filterBarClasses = {
      "mb-4 ml-2 relative inline-block text-left": true,
    };

    return html`<div class=${classMap(filterBarClasses)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-6 h-6 text-alternate opacity-60 inline-flex mr-2"
      >
        <path
          d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
        />
      </svg>
      ${map(
        this.filters,
        (f) => html`<div class="inline-flex relative">
          ${this.buttonTemplate(f.label, f.data.value)}
          ${this.filterMenuTemplate(f)}
        </div> `
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "high-filter-bar": HighFilterBar;
  }
}
