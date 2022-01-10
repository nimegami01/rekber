import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';

@Component({
  selector: 'app-undangan-list',
  templateUrl: './undangan-list.component.html',
  styleUrls: ['./undangan-list.component.css'],
})
export class UndanganListComponent implements OnInit {
  constructor(
    private api: ApiService,
    public global: GlobalVariableService,
    private router: Router
  ) {}

  current_uid: any;
  ngOnInit(): void {
    this.current_uid = localStorage.getItem('uid');
    this.getUndangan();
  }

  getCountUndangan = 0;
  getUndanganData: any;
  loading = true;
  async getUndangan() {
    this.loading = true;
    this.getUndanganData = '';
    this.api.ambilUndangan().onSnapshot(async (res) => {
      let result = [];
      let i = 0;
      res.forEach((doc) => {
        if (doc.data().uid_pembeli == this.current_uid) {
          result[i] = doc.data();
          result[i]['id'] = doc.id;
          i++;
        }
      });

      let result_2 = [];
      for (let i = 0; i < result.length; i++) {
        try {
          let temp = await this.api.getCurrentUserWithId(result[i].uid_penjual);
          let penjual: any;
          temp.forEach((doc_) => {
            penjual = doc_.data();
          });

          try {
            let temp_2 = await this.api
              .getTransactionWithID(result[i].id_transaksi)
              .get();

            let transaksi: any;
            temp_2.forEach((doc_) => {
              transaksi = doc_.data();
            });

            result_2.push({
              data: result[i],
              penjual: penjual,
              transaksi: transaksi,
            });
          } catch {}
        } catch {}
      }
      this.loading = false;
      this.getUndanganData = result_2;
      this.getCountUndangan = this.getUndanganData.length;
    });
  }

  aksiUndangan(action: number, id: any, transaksi_id: any, durasi: any) {
    this.api.aksiUndangan(action, id, transaksi_id, durasi);
  }
}
