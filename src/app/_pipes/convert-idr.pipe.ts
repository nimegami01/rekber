import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertIdr',
})
export class ConvertIdrPipe implements PipeTransform {
  transform(value) {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IDR',
    });

    return formatter.format(value);
  }
}
