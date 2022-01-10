import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'convertToAgo',
})
export class ConvertToAgoPipe implements PipeTransform {
  transform(value: any) {
    const dayago = moment(value * 1000).fromNow();
    return dayago;
  }
}
