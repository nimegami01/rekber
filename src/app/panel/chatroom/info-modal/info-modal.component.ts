import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css'],
})
export class InfoModalComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef, private api: ApiService) {}

  data = {
    id: '',
    judul: '',
    nama_barang: '',
    jenis_barang: '',
    harga: '',
    durasi: '',
    create: '',
    expired: '',
    deskripsi_barang: '',
    syarat_trx_selesai: '',
    id_rek_user: '',
  };

  InfoPenjual: any;
  InfoPembeli: any;

  current_role: any;

  rekBankUser: any;

  ngOnInit(): void {
    this.rekBankUser = '';
    setTimeout(() => {
      if (this.current_role == 'Penjual' || this.current_role == 'admin') {
        this.api.getCurrentBank(this.data.id_rek_user).then((res) => {
          this.rekBankUser = res.data();
        });
      }
    }, 50);
  }
}
