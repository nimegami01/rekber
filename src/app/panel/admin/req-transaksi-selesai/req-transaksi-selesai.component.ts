import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';

@Component({
  selector: 'app-req-transaksi-selesai',
  templateUrl: './req-transaksi-selesai.component.html',
  styleUrls: ['./req-transaksi-selesai.component.css'],
})
export class ReqTransaksiSelesaiComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.searchResult();
  }

  transaksi = [];
  loadingDone = false;
  async searchResult() {
    this.api.getAllTransaksi().onSnapshot(async (res) => {
      this.transaksi = [];
      let result_3 = [];
      res.forEach((doc) => {
        if (doc.data().persetujuan_pembeli && doc.data().persetujuan_penjual) {
          result_3.push(doc.data());
        }
      });
      for (let i = 0; i < result_3.length; i++) {
        try {
          let temp = await this.api.getCurrentUserWithId(
            result_3[i].uid_pembeli
          );

          let data_pembeli: any;

          temp.forEach((doc_user) => {
            data_pembeli = doc_user.data();
          });

          try {
            let temp_ = await this.api.getCurrentUserWithId(
              result_3[i].uid_penjual
            );

            let data_penjual: any;

            temp_.forEach((doc_user) => {
              data_penjual = doc_user.data();
            });

            this.transaksi.push({
              data: result_3[i],
              pembeli: data_pembeli,
              penjual: data_penjual,
            });
          } catch {}
        } catch {}
      }
      this.loadingDone = true;
    });
  }
}
