import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-pengaturan-modal',
  templateUrl: './pengaturan-modal.component.html',
  styleUrls: ['./pengaturan-modal.component.css'],
})
export class PengaturanModalComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef, private api: ApiService) {}

  id_transaksi: string;
  current_transaksi: any;
  uid: string;
  transaksiChecker: string;
  current_role: string;
  statusBarang = false;
  statusPembayaran = 0;

  alasan = new FormControl('');
  durasi = new FormControl('');

  loading = true;
  tambahDurasiPending = false;
  listReqPerpanjang = [];

  listPembatalanTransaksi = [];
  ngOnInit(): void {
    this.loading = true;
    this.durasi.setValue(1);
    setTimeout(() => {
      if (this.current_role == 'Pembeli') {
        // Cek Kirim Barang
        this.api.getKirimBarang(this.id_transaksi).onSnapshot((res) => {
          let result = [];
          res.forEach((doc) => {
            result.push({ data: doc.data(), id: doc.id });
          });
          if (result.length) {
            this.statusBarang = true;
          } else {
            this.statusBarang = false;
          }
        });
      } else if (this.current_role == 'Penjual') {
        // Cek pembayaran
        this.api
          .cekPembayaran(this.id_transaksi)
          .onSnapshot(async (res: any) => {
            res.forEach(async (doc) => {
              this.statusPembayaran = doc.data().statusPembayaran;
            });
          });
      }

      // Cek pembatalan transaksi

      this.api.cekPembatalanTransaksi(this.id_transaksi).onSnapshot((res) => {
        this.listPembatalanTransaksi = [];

        res.forEach((doc) => {
          if (
            doc.data().id_transaksi == this.id_transaksi &&
            this.uid == doc.data().uid &&
            doc.data().status == 0
          ) {
            this.listPembatalanTransaksi.push({
              data: doc.data(),
              id: doc.id,
            });
          }
        });
      });

      // Cek Perpanjang Transaksi
      this.api.cekPerpanjangTransaksi(this.id_transaksi).onSnapshot((res) => {
        this.loading = true;
        this.listReqPerpanjang = [];
        this.tambahDurasiPending = false;
        res.forEach((doc) => {
          if (doc.data().id_transaksi == this.id_transaksi) {
            this.listReqPerpanjang.push({
              data: doc.data(),
              id: doc.id,
            });
          }
          if (
            doc.data().id_transaksi == this.id_transaksi &&
            doc.data().status == 0
          ) {
            this.tambahDurasiPending = true;
          }
        });
        this.loading = false;
      });
    }, 10);
  }

  reqTransaksi() {
    if (
      this.id_transaksi &&
      this.alasan.value &&
      this.uid &&
      this.durasi.value
    ) {
      this.api
        .reqPerpanjangTransaksi(
          this.id_transaksi,
          this.alasan.value,
          this.uid,
          this.durasi.value
        )
        .then((res) => {
          this.api.addPesanSistem(
            this.id_transaksi,
            `penjual telah melakukan request penambahan durasi transaksi <strong>[${res.id}]</strong>.`
          );
        });
    }
  }

  batalTransaksi(id: any) {
    this.api.actionPerpanjangTransaksi(id, 3).then((res) => {
      this.api.addPesanSistem(
        this.id_transaksi,
        `penjual telah membatalkan request penambahan durasi transaksi <strong>[${id}]</strong>.`
      );
    });
  }

  transaksiSelesai() {
    this.api.transaksiSelesai(this.id_transaksi, this.current_role).then(
      (res: any) => {
        this.api.addPesanSistem(
          this.id_transaksi,
          `${this.current_role} telah melakukan request transaksi selesai <strong>[${this.id_transaksi}]</strong>.`
        );
      },
      (error: any) => {
        alert('Error saat mengirim permintaan transaksi selesai.');
      }
    );
  }

  reqPembatanTransaksi() {
    this.api.reqPembatalanTransaksi(this.id_transaksi, this.current_role).then(
      (res: any) => {
        this.api.addPesanSistem(
          this.id_transaksi,
          `${this.current_role} telah melakukan request pembatalan transaksi <strong>[${res.id}]</strong>.`
        );
      },
      (err: any) => {
        alert('Error saat mengirim permintaan pembatalan transaksi selesai.');
      }
    );
  }

  AksiPembatalanTransaksi(id: any, action: number) {
    this.api.aksiPembatalanTransaksi(id, action).then(
      (res: any) => {
        if (action == 3) {
          this.api.addPesanSistem(
            this.id_transaksi,
            `${this.current_role} telah membatalkan request pembatalan transaksi <strong>[${id}]</strong>.`
          );
        }
      },
      (err: any) => {
        alert('Error saat mengirim permintaan.');
      }
    );
  }
}
