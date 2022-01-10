import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondToDate',
})
export class SecondToDatePipe implements PipeTransform {
  transform(value: any) {
    var hari = ~~(value / (3600 * 24));
    var hours = ~~((value % (3600 * 24)) / 3600);
    var minutes = ~~((value % 3600) / 60);
    var seconds = ~~value % 60;
    return (
      (hari > 0 ? hari + ' hari ' : '') +
      (hours > 0 ? hours + ' jam ' : '') +
      (!hari
        ? (minutes > 0 ? minutes + ' menit ' : '') +
          (seconds >= 0 ? seconds + ' detik' : '0 detik')
        : '')
    );
  }
}
