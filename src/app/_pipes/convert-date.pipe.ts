import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'convertDate',
})
export class ConvertDatePipe implements PipeTransform {
  transform(value: any) {
    moment.locale('id');
    let data = '';
    if (value) {
      data = moment(value * 1000).format('LLL');
    }
    return data;
  }
}
