import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-lihat-barang',
  templateUrl: './lihat-barang.component.html',
  styleUrls: ['./lihat-barang.component.css'],
})
export class LihatBarangComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef, private api: ApiService) {}

  transaksi: any;

  lihatBrang: any;
  loading = true;
  ngOnInit(): void {
    setTimeout(() => {
      this.loading = true;
      this.lihatBrang = '';
      this.api.getKirimBarang(this.transaksi.id).onSnapshot((res) => {
        let result = [];
        res.forEach((doc) => {
          result.push({ data: doc.data(), id: doc.id });
        });
        if (result.length) {
          this.lihatBrang = result;
        }
        this.loading = false;
      });
    }, 10);
  }
}
