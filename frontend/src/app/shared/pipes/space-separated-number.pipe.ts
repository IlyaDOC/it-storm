import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceSeparatedNumber'
})
export class SpaceSeparatedNumberPipe implements PipeTransform {

  transform(value: number): string {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

}
