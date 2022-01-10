import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-validasi-pembayaran',
  templateUrl: './validasi-pembayaran.component.html',
  styleUrls: ['./validasi-pembayaran.component.css'],
})
export class ValidasiPembayaranComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getPembayaran();
    this.pembayaranSelesai();
    this.pembayaranTolak();
  }

  listPembayaran = [];
  loading = true;
  getPembayaran() {
    this.api.semuaPembayaran().onSnapshot(async (res) => {
      this.loading = true;
      this.listPembayaran = [];
      let data = [];
      res.forEach((doc) => {
        data.push({ id: doc.id, data: doc.data() });
      });

      let i = 0;
      for (let a of data) {
        await this.api
          .getCurrentTransaction(a.data.id_transaksi)
          .get()
          .then((res_2) => {
            res_2.forEach((doc_) => {
              this.listPembayaran[i] = {
                pembayaran: { id: a.id, data: a.data },
                transaksi: doc_.data(),
              };
            });
          })
          .catch((err) => console.log(err));
        i++;
      }

      this.loading = false;
    });
  }

  listPembayaranSelesai = [];
  pembayaranSelesai() {
    this.api.semuaPembayaran(2).onSnapshot(async (res) => {
      this.listPembayaranSelesai = [];
      let data = [];
      res.forEach((doc) => {
        data.push({ id: doc.id, data: doc.data() });
      });

      let i = 0;
      for (let a of data) {
        await this.api
          .getCurrentTransaction(a.data.id_transaksi)
          .get()
          .then((res_2) => {
            res_2.forEach((doc_) => {
              this.listPembayaranSelesai[i] = {
                pembayaran: { id: a.id, data: a.data },
                transaksi: doc_.data(),
              };
            });
          })
          .catch((err) => console.log(err));
        i++;
      }
    });
  }

  listPembayaranTolak = [];
  pembayaranTolak() {
    this.api.semuaPembayaran(0).onSnapshot(async (res) => {
      this.listPembayaranTolak = [];
      let data = [];
      res.forEach((doc) => {
        data.push({ id: doc.id, data: doc.data() });
      });

      let i = 0;
      for (let a of data) {
        await this.api
          .getCurrentTransaction(a.data.id_transaksi)
          .get()
          .then((res_2) => {
            res_2.forEach((doc_) => {
              this.listPembayaranTolak[i] = {
                pembayaran: { id: a.id, data: a.data },
                transaksi: doc_.data(),
              };
            });
          })
          .catch((err) => console.log(err));
        i++;
      }
    });
  }

  actionPembayaran(action: number, id: any, id_transaksi = '') {
    this.api.actionPembayaran(action, id).then((res) => {
      if (id_transaksi) {
        let pesan = '';
        if (action == 0) {
          pesan = 'Admin menolak pembayaran.';
        } else if (action == 2) {
          pesan = 'Admin menyetujui pembayaran.';
        }
        this.api.addPesanSistem(id_transaksi, pesan);
      }
    });
  }
}
