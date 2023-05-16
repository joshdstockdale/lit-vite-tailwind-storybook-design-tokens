import {directive, Directive} from 'lit/directive.js'
import {dateConverter} from './date'
import {html} from 'lit'

class ConverterDirective extends Directive {
  data: string;

  render(data: any){
     return data;
  }
}

export const converter = directive(ConverterDirective)