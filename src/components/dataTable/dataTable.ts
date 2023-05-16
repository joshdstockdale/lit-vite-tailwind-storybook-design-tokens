import { customElement, property, state } from "lit/decorators.js";
import { ClassInfo, classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { repeat } from "lit/directives/repeat.js";
import { range } from "lit/directives/range.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { dateConverter } from "../../common/directives/date";
import { numberConverter } from "../../common/directives/number";
import { html, PropertyValues, TemplateResult } from "lit";
import "../loader/loader";
import "../filterBar/filterBar";
import HighBaseElement from "../base/base";
import {
  ParseColor,
  getContrastForegroundColor,
  hex2rgb,
} from "../../common/utilities/color";
import { IColorProp } from "../../common/types";

interface IDataTableHeaderData {
  prefix?: string;
  value: string;
  suffix?: string;
  type?: string;
}
export interface IDataTableHeader {
  label: string;
  data: IDataTableHeaderData;
  sort?: boolean;
  filter?: boolean;
}
export interface IDataTableConfig {
  rowID: string;
}
export interface IStringStringObj {
  [x: string]: string;
}
interface IDataTablePaginate {
  pageSizes: number[];
  defaultPageSize?: number;
}
enum EDataComparator {
  eq,
  from,
  to,
  gt,
  gte,
  lt,
  lte,
}
interface IDataFilter {
  key: string;
  val: string | number | Date;
  comp: EDataComparator;
}
enum EDataSortDirection {
  asc,
  desc,
}
enum EDataType {
  string,
  number,
  date,
}
interface IDataSort {
  col: string;
  dir: EDataSortDirection;
  type: EDataType;
}

@customElement("high-data-table")
export default class HighDataTable extends HighBaseElement {
  @property() title: string;
  @property({ type: Array }) headers: IDataTableHeader[];
  @property({ type: Array }) data: IStringStringObj[];
  @property({ type: Object }) config: IDataTableConfig;
  @property({ type: Object }) paginate: IDataTablePaginate = {
    pageSizes: [15],
  };
  @property({ type: Array }) filters: IDataFilter[];
  @property({ type: Array }) sort: IDataSort[];

  @state() currentPage = 1;
  @state() limit = 10;
  @state() sortDirection: 0 | 1 = 0;
  @state() sortKey: string;
  @state() loading: Boolean = false;
  get getLoading() {
    return this.loading;
  }
  get pagedData() {
    return this._paginate(this.data, this.fromRecord, this.toRecord);
  }
  get total() {
    return this.data.length;
  }
  get pageCount() {
    return Math.ceil(this.total / this.limit);
  }
  get fromRecord() {
    return this.currentPage === 1
      ? this.currentPage
      : (this.currentPage - 1) * this.limit + 1;
  }
  get toRecord() {
    return this.currentPage * this.limit > this.total
      ? this.total
      : this.currentPage * this.limit;
  }
  get startEllipsis() {
    // No ellisis if pages less than 8
    if (this.pageCount <= 8) return [];
    // no start ellipsis
    if (this.currentPage <= 3 || this.currentPage >= this.pageCount - 1)
      return [];
    // if user has gone past #3, return 2 thru (currentPage-pageThreshold)
    return range(1, this.currentPage - 2);
  }
  get middleEllipsis() {
    // No ellisis if pages less than 8
    if (this.pageCount <= 8) return [];
    // return #s 4 thru 23
    if (this.currentPage <= 2 || this.currentPage >= this.pageCount - 1)
      return range(3, this.pageCount - 3);
    // otherwise no middle Ellipsis
    return [];
  }
  get endEllipsis() {
    // No ellisis if pages less than 8
    if (this.pageCount <= 8) return [];
    // Need end ellipsis
    if (this.currentPage > 2 && this.currentPage < this.pageCount)
      return range(this.currentPage + 1, this.pageCount - 1);
    // else no end ellipsis
    return [];
  }
  async goToPage(page: number) {
    this.loading = true;
    await this.delay(100);
    this.currentPage = page;
    this.loading = false;
  }
  increasePageSize(pageSize: number) {
    this.limit = pageSize;
  }
  async sortBy(key: string) {
    this.loading = true;

    await this.delay(100);
    this.currentPage = 1;

    if (key === this.sortKey) {
      this.sortDirection = (1 - this.sortDirection) as 0 | 1;
    } else {
      this.sortDirection = 0;
    }

    this.sortKey = key;
    this.data = [
      ...this.data.sort(this.compareValues(this.sortKey, this.sortDirection)),
    ];
    this.loading = false;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  templateTheHeaders(headers: IDataTableHeader[]) {
    const headerItems: TemplateResult[] = [];
    const thClasses = {
      "py-0 px-4 font-semibold text-black bg-white sm:table-cell text-left font-sans text-ellipsis overflow-hidden whitespace-nowrap h-11 border-gray-200 border-r":
        true,
    };

    this.headers.forEach((header) => {
      const sortClass = {
        "ml-1 rounded text-gray-100 group-hover:text-gray-400 animate-spin-down":
          true,
        "text-gray-400": this.sortKey === header.data.value,
        "animate-spin-up":
          this.sortKey === header.data.value && this.sortDirection === 1,
        "rotate-180":
          this.sortKey === header.data.value && this.sortDirection === 1,
        "group-hover:text-white": !ifDefined(header.sort),
        "text-white": !ifDefined(header.sort),
      };
      const buttonClass = {
        "group inline-flex cursor-pointer items-center": true,
        "cursor-default": !ifDefined(header.sort),
      };

      headerItems.push(html`<th
        style="border-style:inset;"
        scope="col"
        class=${classMap(thClasses)}
      >
        <button
          @click=${() => this.sortBy(header.data.value)}
          ?disabled=${!ifDefined(header.sort)}
          class=${classMap(buttonClass)}
        >
          ${header.label}
          <span class=${classMap(sortClass)}>
            <svg
              class="h-5 w-5"
              x-description="Heroicon name: mini/chevron-down"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
        </button>
      </th>`);
    });
    return headerItems;
  }

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
        ring: this.color,
        text: text,
      } as IColorProp);
    }
  }

  render() {
    const headerClasses = {
      "px-5 rounded-t-lg bg-gray-50 shadow ring-1 ring-gray-300": true,
    };
    const wrapperClasses = {
      "relative overflow-auto shadow ring-1 ring-gray-300": true,
    };
    const tableClasses = {
      "min-w-full border-separate border-spacing-0": true,
    };
    const trClasses = {
      "border-b border-gray-200 odd:bg-gray-100": true,
    };
    const theadClasses = {
      "drop-shadow-sm sticky top-0": true,
    };
    const tbodyClasses = {
      "bg-white overflow-auto": true,
    };
    const tfootClasses = {
      "bg-gray-50 sticky bottom-0": true,
    };
    const footerClasses = {
      "flex items-center justify-between px-6 py-1 bg-gray-100 rounded-b-lg shadow ring-1 ring-gray-300":
        true,
    };

    return html`<high-filter-bar
        .headers=${this.headers}
        .data=${this.data}
        .config=${this.config}
        .color=${this.color}
      ></high-filter-bar>
      <div
        class=${classMap(headerClasses)}
        style="${this.inline.background}${this.inline.text}"
      >
        <h1
          class=${classMap({
            "py-2": !!ifDefined(this.title) && this.title !== "",
          })}
        >
          ${this.title}
        </h1>
      </div>
      <div
        style="height: 523px;"
        class=${classMap(wrapperClasses)}
        @scroll=${this._handleScroll}
      >
        <high-loader speed="fast" ?loading=${this.getLoading}></high-loader>

        <table class=${classMap(tableClasses)}>
          <thead class=${classMap(theadClasses)}>
            <tr>
              ${this.templateTheHeaders(this.headers)}
            </tr>
          </thead>
          <tbody class=${classMap(tbodyClasses)}>
            ${repeat(
              this.pagedData,
              (d) => d[this.config.rowID],
              (d) =>
                html`<tr class=${classMap(trClasses)}>
                  ${map(
                    this.headers,
                    (header) => html`${this._templateTheCell(d, header)}`
                  )}
                </tr>`
            )}
          </tbody>
          <!-- <tfoot class=${classMap(tfootClasses)}>
          <tr>
            <td class="border-t border-gray-200" colspan=${this.headers.length}>
              
            </td>
          </tr>
        </tfoot> -->
        </table>
      </div>
      <div class=${classMap(footerClasses)}>
        ${this._showResults()} ${this._pageNavigation()}
      </div>`;
  }

  private _pageNavigation() {
    return html`<div
      class="flex items-center justify-between  px-4 py-3 sm:px-6 bg-transparent"
    >
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <nav
            class="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              class=${classMap({
                "relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20":
                  true,
                disabled: this.currentPage === 1,
              })}
              ?disabled=${this.currentPage === 1}
              @click=${() => this.goToPage(this.currentPage - 1)}
            >
              <span class="sr-only">Previous</span>
              <!-- Heroicon name: mini/chevron-left -->
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            ${map(range(this.pageCount), (page) => this._getPageButton(page))}
            <button
              class=${classMap({
                "relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20":
                  true,
                disabled: this.currentPage === this.pageCount,
              })}
              ?disabled=${this.currentPage === this.pageCount}
              @click=${() => this.goToPage(this.currentPage + 1)}
            >
              <span class="sr-only">Next</span>
              <!-- Heroicon name: mini/chevron-right -->
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div> `;
  }

  private _getPageButton(page: number) {
    if ([...this.middleEllipsis].length > 0) {
      // if first in the range, show ellipsis
      if ([...this.middleEllipsis].indexOf(page) === 0) {
        return html`<span
          class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
          >...</span
        > `;
      } else if ([...this.middleEllipsis].indexOf(page) > 0) {
        // return empty
        return;
      }
    }
    if ([...this.startEllipsis].length) {
      // if first in the range, show ellipsis
      if ([...this.startEllipsis].indexOf(page) === 0) {
        return html`<span
          class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
          >...</span
        > `;
      } else if ([...this.startEllipsis].indexOf(page) > 0) {
        // return empty
        return;
      }
    }

    if ([...this.endEllipsis].length) {
      // if first in the range, show ellipsis
      if ([...this.endEllipsis].indexOf(page) === 0) {
        return html`<span
          class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
          >...</span
        > `;
      } else if ([...this.endEllipsis].indexOf(page) > 0) {
        // return empty
        return;
      }
    }

    // Show default button
    return html`<button
      class=${classMap({
        "relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20":
          true,
        disabled: this.currentPage === page + 1,
      })}
      ?disabled=${this.currentPage === page + 1}
      @click=${() => this.goToPage(page + 1)}
    >
      ${page + 1}
    </button>`;
  }

  private _showResults() {
    return html`<div>
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">${this.fromRecord}</span>
        to
        <span class="font-medium">${this.toRecord}</span>
        of
        <span class="font-medium">${this.total}</span>
        results
      </p>
    </div>`;
  }

  private _handleScroll(e: Event) {
    if (!!e.target) {
      const { scrollTop, scrollHeight, clientHeight } = e.target as Element;
      //console.log("position: ", scrollTop, scrollHeight, clientHeight);
      const currentPage = 1;
      const limit = 10;
      const total = 20;
      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        this._hasMore(currentPage, limit, total)
      ) {
        console.log("show more and increment currentPage");
      }
    }
  }
  private _hasMore(currentPage: number, limit: number, total: number) {
    return currentPage * limit < total;
  }

  private _paginate(
    data: IStringStringObj[],
    fromRecord: number,
    toRecord: number
  ) {
    return data.slice(fromRecord - 1, toRecord);
  }

  private _templateTheCell(
    dataRow: IStringStringObj,
    header: IDataTableHeader
  ) {
    const tdClasses = {
      "py-1 px-4 text-black font-sans h-12": true,
    };
    if (!(header.data.value in dataRow) || !dataRow[header.data.value])
      return html`<td class=${classMap(tdClasses)}>-</td>`;

    return html`<td class=${classMap(this._styleCell(header, tdClasses))}>
      ${this._getPrefixTemplate(header.data, dataRow)}${this._convertData(
        dataRow[header.data.value],
        header
      )}${this._getSuffixTemplate(header.data, dataRow)}
    </td>`;
  }
  private _styleCell(header: IDataTableHeader, commonClasses: ClassInfo) {
    let classes = "";
    if (!!header.data.type) {
      switch (header.data.type) {
        case "number":
        case "float":
          classes += "text-right";
          break;
        default:
          classes += "text-left";
      }
    }
    return { ...commonClasses, [classes]: classes };
  }
  private _convertData(data: string | number, header: IDataTableHeader) {
    let dataResult: TemplateResult = html`${data}`;

    if (!!header.data.type) {
      switch (header.data.type) {
        case "date":
          dataResult = html`${dateConverter(data as string)}`;
          break;
        case "number":
          dataResult = html`${data}`;
          break;
        case "float":
          dataResult = html`${numberConverter(data as number)}`;
          break;
      }
    }
    return dataResult;
  }
  private _getPrefixTemplate(
    data: IDataTableHeaderData,
    dataRow: IStringStringObj
  ) {
    if (!data.prefix) return "";

    let prefixResult: string = data.prefix;
    if (data.prefix in dataRow) {
      prefixResult = dataRow[data.prefix];
    }
    return html`<span class="text-gray-400">${prefixResult} </span>`;
  }
  private _getSuffixTemplate(
    data: IDataTableHeaderData,
    dataRow: IStringStringObj
  ) {
    if (!data.suffix) return "";

    let suffixResult: string = data.suffix;
    if (data.suffix in dataRow) {
      suffixResult = dataRow[data.suffix];
    }
    return html`<span class="text-gray-400"> ${suffixResult}</span>`;
  }

  private _sortByAlphaNum(
    data: IStringStringObj[],
    key: string,
    direction: 0 | 1
  ) {
    console.log("direction", direction);
    return data.sort(this.compareValues(key, direction));
  }
  private compareValues(key: string, direction = 0) {
    return function innerSort(a: IStringStringObj, b: IStringStringObj) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return direction === 1 ? comparison * -1 : comparison;
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "high-data-table": HighDataTable;
  }
}
