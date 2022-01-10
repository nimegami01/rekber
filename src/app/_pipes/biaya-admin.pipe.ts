import { Pipe, PipeTransform } from '@angular/core';
import { GlobalVariableService } from '../_global/global-variable.service';

@Pipe({
  name: 'biayaAdmin',
})
export class BiayaAdminPipe implements PipeTransform {
  constructor(public global: GlobalVariableService) {}

  transform(value, check) {
    let total_bayar: number;
    let fee: number;
    if (value <= 100000) {
      fee = this.global.fee.dibawah_100k;
      total_bayar = value + fee;
    } else if (value > 100000) {
      let hitung = Math.ceil(value / 100000) - 1;
      fee =
        this.global.fee.dibawah_100k + hitung * this.global.fee.kelipatan_100k;
      total_bayar = value + fee;
    }

    if (check == 'fee') {
      return fee;
    } else if (check == 'total') {
      return total_bayar;
    }
  }
}
