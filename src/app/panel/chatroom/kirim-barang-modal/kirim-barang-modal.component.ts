import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-kirim-barang-modal',
  templateUrl: './kirim-barang-modal.component.html',
  styleUrls: ['./kirim-barang-modal.component.css'],
})
export class KirimBarangModalComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef, private api: ApiService) {}

  transaksi: any;

  informasiBarang = new FormControl('');
  catatanTambahan = new FormControl('');

  loading = false;
  kirimBarangChecker = true;

  statusPembayaran = 0;

  riwayatInfoBarang = [];
  ngOnInit(): void {
    setTimeout(() => {
      this.api.getKirimBarang(this.transaksi.id).onSnapshot((res) => {
        let result = [];
        res.forEach((doc) => {
          result.push({ data: doc.data(), id: doc.id });
        });
        this.riwayatInfoBarang = result;
      });

      this.api.cekPembayaran(this.transaksi.id).onSnapshot(async (res: any) => {
        let i = 0;
        res.forEach(async (doc) => {
          if (i == 0) {
            this.statusPembayaran = doc.data().statusPembayaran;
          }
          i++;
        });
      });
    }, 10);
  }

  kirimBarang() {
    if (this.informasiBarang.value) {
      this.api
        .addKirimBarang(
          this.transaksi.id,
          this.informasiBarang.value,
          this.catatanTambahan.value
        )
        .then((res) => {
          const pesan =
            'penjual telah mengirim barang ' +
            this.transaksi.jenis_barang +
            ' <strong>[' +
            res.id +
            ']</strong>.';
          this.api.addPesanSistem(this.transaksi.id, pesan);
        });
    }
  }
}
