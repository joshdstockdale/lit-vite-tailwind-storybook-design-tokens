import { directive, Directive } from "lit/directive.js";

class NumberDirective extends Directive {
  data: number;

  render(data: number) {
    // check if the passed value is a number
    if (typeof data === "number" && !isNaN(data)) {
      // Is a float
      return data.toFixed(2);
    }
    return;
  }
}

export const numberConverter = directive(NumberDirective);
