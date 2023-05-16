import { customElement, property, state } from "lit/decorators.js";
import HighBaseElement from "../base/base";
import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { range } from "lit/directives/range.js";
import { map } from "lit/directives/map.js";
import { format, getDaysInMonth, sub, add, startOfDay } from "date-fns";
import { animate } from "@lit-labs/motion";

interface IClickedDate {
  from: Date;
  to: Date;
}
@customElement("high-calendar")
export default class HighCalendar extends HighBaseElement {
  private now = startOfDay(new Date());
  @state() current = startOfDay(new Date());

  get currentMonth() {
    return format(this.current, "MMMM");
  }
  get currentYear() {
    return format(this.current, "yyyy");
  }
  get currentDay() {
    return parseInt(format(this.current, "d"));
  }
  get currentDayOfWeek() {
    return format(this.current, "EEEEEE"); // same format as daysOfTheWeek
  }

  get daysInMonth() {
    return getDaysInMonth(this.current);
  }
  get daysOfTheWeek() {
    return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  }
  get firstDateOfMonth() {
    return new Date(`${this.currentYear}-${this.currentMonth}-01`);
  }
  get lastDateOfMonth() {
    return new Date(
      `${this.currentYear}-${this.currentMonth}-${this.daysInMonth}`
    );
  }
  get daysBeforeCurrentMonth() {
    const firstDayOfWeek = format(this.firstDateOfMonth, "EEEEEE");
    const daysLeft = this.daysOfTheWeek.indexOf(firstDayOfWeek);
    const goBack = sub(this.firstDateOfMonth, { days: daysLeft });

    const goBackDay = parseInt(format(goBack, "d")) - 1;
    return range(goBackDay, goBackDay + daysLeft);
  }
  get daysAfterCurrentMonth() {
    const lastDayOfWeek = format(this.lastDateOfMonth, "EEEEEE");
    const daysLeft =
      this.daysOfTheWeek.length -
      (this.daysOfTheWeek.indexOf(lastDayOfWeek) + 1);
    if (daysLeft === 0) {
      return range(0);
    }
    const goFuture = add(this.lastDateOfMonth, { days: daysLeft });
    const goToLastDay = getDaysInMonth(goFuture);
    return range(parseInt(format(goFuture, "d"), goToLastDay));
  }

  @state() clicked: IClickedDate;

  _prevMonth(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.current = sub(this.current, { months: 1 });
  }
  _nextMonth(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    this.current = add(this.current, { months: 1 });
  }
  dayTemplate(day: number, notInCurrentMonth: boolean = false) {
    const dayClasses = {
      "bg-white py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10": true,
      "text-highlight":
        this.now.getTime() ===
        new Date(
          `${this.currentYear}-${this.currentMonth}-${day + 1}`
        ).getTime(),
      "bg-alternate": false,
      "bg-opacity-25": false,
      "rounded-l-full": false,
      "bg-gray-50 text-gray-400": notInCurrentMonth,
    };
    const timeClasses = {
      "mx-auto flex h-7 w-7 items-center justify-center ": true,
    };
    return html`<button type="button" class=${classMap(dayClasses)}>
      <time datetime="2022-01-01" class=${classMap(timeClasses)}
        >${day + 1}</time
      >
    </button>`;
  }
  render() {
    return html`<div class="max-w-md flex-none md:block animate-fade-in">
      <div class="flex items-center text-center text-gray-900">
        <button
          type="button"
          class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          @click=${this._prevMonth}
        >
          <span class="sr-only">Previous month</span>
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
        <div class="flex-auto font-semibold">
          ${this.currentMonth} ${this.currentYear}
        </div>
        <button
          type="button"
          class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          @click=${this._nextMonth}
        >
          <span class="sr-only">Next month</span>
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
      </div>
      <div
        class="mt-6 grid grid-cols-7 text-center text-xs leading-6 text-gray-500"
      >
        ${map(this.daysOfTheWeek, (day) => html`<div>${day}</div>`)}
      </div>
      <div
        class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200"
      >
        ${map(this.daysBeforeCurrentMonth, (day) =>
          this.dayTemplate(day, true)
        )}
        ${map(range(this.daysInMonth), (day) => this.dayTemplate(day))}
        ${map(this.daysAfterCurrentMonth, (day) => this.dayTemplate(day, true))}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "high-calendar": HighCalendar;
  }
}
