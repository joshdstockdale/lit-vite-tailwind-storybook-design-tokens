import { LitElement } from "lit";
declare const TwLitElement: typeof LitElement;
export default class HighBaseElement extends TwLitElement {
    dir: string;
    lang: string;
    emit(name: string, options?: CustomEventInit): CustomEvent<any>;
}
export {};
