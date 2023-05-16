import { type LitElement } from "lit";
declare global {
    export type LitMixin<T = unknown> = new (...args: any[]) => T & LitElement;
}
export declare const TW: <T extends LitMixin<unknown>>(superClass: T) => T;
