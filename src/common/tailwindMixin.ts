import { adoptStyles, type LitElement, unsafeCSS } from "lit"
import style from './styles/tailwind.global.css' 
import theme from './styles/themes/fancy/build/css/variables.css'

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  export type LitMixin<T = unknown> = new (...args: any[]) => T & LitElement;
}

const stylesheet = unsafeCSS(style+theme)

export const TW = <T extends LitMixin>(superClass: T): T =>
  class extends superClass {

    /* Look at theme and add all classes that line up with dynamic values. Not supporting default theme stuff, only specific theme defined.
    ** font: caption = 'font-sans text-base font-normal uppercase'
    ** color: bg-{colors}
    */
    connectedCallback() {
      super.connectedCallback();
      if(this.shadowRoot)
        adoptStyles(this.shadowRoot, [stylesheet])
    }
  };