import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private api: ApiService,
    public global: GlobalVariableService,
    private router: Router
  ) {}

  transaksi = {
    all: [],
    open: [],
    failed: [],
    cancel: [],
    success: [],
    pending: [],
  };

  loopTransaksi = [
    { id: 'all', title: 'Semua Transaksi' },
    { id: 'open', title: 'Transaksi Yang Sedang Berlangsung' },
    { id: 'pending', title: 'Transaksi Pending' },
    { id: 'success', title: 'Transaksi Selesai' },
    { id: 'failed', title: 'Transaksi Gagal' },
    { id: 'cancel', title: 'Transaksi Dibatalkan' },
  ];

  current_uid: any;
  ngOnInit(): void {
    this.current_uid = localStorage.getItem('uid');
    this.getAllTransaksi();
    this.getUndangan();
  }

  getCountUndangan = 0;
  getUndanganData: any;
  async getUndangan() {
    this.getUndanganData = '';
    this.api.ambilUndangan().onSnapshot(async (res) => {
      let result = [];
      let i = 0;
      res.forEach((doc) => {
        if (doc.data().uid_pembeli == this.current_uid) {
          if (doc.data().status == 0) {
            result[i] = doc.data();
            result[i]['id'] = doc.id;
            i++;
          }
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

            if (transaksi.status == 'active' && !transaksi.uid_pembeli) {
              result_2.push({
                data: result[i],
                penjual: penjual,
                transaksi: transaksi,
              });
            }
          } catch {}
        } catch {}
      }
      this.getUndanganData = result_2.slice(0, 5);
      this.getCountUndangan = this.getUndanganData.length;
    });
  }

  aksiUndangan(action: number, id: any, transaksi_id: any, durasi: any) {
    this.api.aksiUndangan(action, id, transaksi_id, durasi);
  }

  loading = true;
  // Get All Transaksi
  async getAllTransaksi() {
    this.loading = true;
    this.api.getAllTransaksi().onSnapshot(async (res) => {
      this.transaksi.all = [];
      this.transaksi.open = [];
      this.transaksi.failed = [];
      this.transaksi.cancel = [];
      this.transaksi.success = [];
      this.transaksi.pending = [];

      res.forEach(async (doc) => {
        let data: any;
        if (
          doc.data().uid_penjual == this.current_uid ||
          doc.data().uid_pembeli == this.current_uid
        ) {
          let infoUser = await this.getUserInfoPost(
            doc.data().uid_penjual,
            doc.data().uid_pembeli
          );

          data = {
            data: doc.data(),
            penjual: infoUser.penjual,
            pembeli: infoUser.pembeli,
          };

          this.transaksi.all.push(data);

          let penjual: any;
          let pembeli: any;

          if (
            doc.data().status == 'active' &&
            doc.data().uid_penjual &&
            doc.data().uid_pembeli
          ) {
            this.transaksi.open.push(data);
          }

          if (doc.data().status == 'failed') {
            this.transaksi.failed.push(data);
          }

          if (doc.data().status == 'cancel') {
            this.transaksi.cancel.push(data);
          }

          if (doc.data().status == 'success') {
            this.transaksi.success.push(data);
          }

          if (
            doc.data().status == 'active' &&
            (!doc.data().uid_penjual || !doc.data().uid_pembeli)
          ) {
            this.transaksi.pending.push(data);
          }
        }
      });
      this.transaksi.all.slice(0, 5);
      this.transaksi.open.slice(0, 5);
      this.transaksi.failed.slice(0, 5);
      this.transaksi.cancel.slice(0, 5);
      this.transaksi.success.slice(0, 5);
      this.transaksi.pending.slice(0, 5);
      this.loading = false;
    });
  }

  logout() {
    this.api.logout();
  }

  async getUserInfoPost(uid_penjual: any, uid_pembeli: any) {
    let penjual: any;
    let pembeli: any;
    try {
      let temp = await this.api.getCurrentUserWithId(uid_penjual);

      temp.forEach((doc) => {
        penjual = doc.data();
      });

      try {
        let temp_2 = await this.api.getCurrentUserWithId(uid_pembeli);

        temp_2.forEach((doc) => {
          pembeli = doc.data();
        });
      } catch {}
    } catch {}

    return { penjual: penjual, pembeli: pembeli };
  }

  searchValue = new FormControl('');

  search() {
    this.router.navigateByUrl(
      '/user/list/search?type=all&status=all&search=' +
        this.searchValue.value +
        '&role=all'
    );
  }
}
