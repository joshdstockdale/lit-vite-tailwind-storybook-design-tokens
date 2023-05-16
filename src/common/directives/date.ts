import { format } from "date-fns";
import { directive, Directive } from "lit/directive.js";

class DateDirective extends Directive {
  data: string;

  render(data: string) {
    if (typeof data === "string" && data.includes("/Date(")) {
      const searchRegExp = /\/Date\(/g;
      const searchRegExp2 = /\)\//g;
      const epoch = parseInt(
        data.replace(searchRegExp, "").replace(searchRegExp2, "")
      );
      if (!!epoch) return format(new Date(epoch), "MM/dd/yyyy");
    }
    return data;
  }
}

export const dateConverter = directive(DateDirective);
