import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';

@Component({
  selector: 'app-create-chatroom',
  templateUrl: './create-chatroom.component.html',
  styleUrls: ['./create-chatroom.component.css'],
})
export class CreateChatroomComponent implements OnInit {
  constructor(
    private api: ApiService,
    public global: GlobalVariableService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  form_create = this.fb.group({
    judul: new FormControl('', [Validators.required]),
    nama_barang: new FormControl('', [Validators.required]),
    jenis_barang: new FormControl('', [Validators.required]),
    harga_barang: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    deskripsi: new FormControl('', [Validators.required]),
    syarat: new FormControl('', [Validators.required]),
    id_akun_rek: new FormControl('', [Validators.required]),
  });

  loading = true;
  duration: any;
  bankList = [];
  error = false;
  async ngOnInit() {
    this.loading = true;
    this.bankList = [];
    this.duration = '';
    this.error = false;
    // Get Durasi
    try {
      let duration = await this.api.getDurationSettings();
      this.duration = duration.data();

      // Get Bank List
      this.api.getBankList().onSnapshot(async (res) => {
        this.bankList = [];
        res.forEach(async (a) => {
          this.bankList.push({ id: a.id, data: a.data() });
        });
      });
    } catch {
      this.error = true;
    }
    this.loading = false;
  }

  loadingCreate = false;
  msgError: any;
  createNewTransaction() {
    this.msgError = '';
    if (!this.form_create.invalid) {
      this.loadingCreate = true;
      // Get Fee
      let total_bayar: number;
      let fee: number;
      if (this.form_create.value.harga_barang <= 100000) {
        fee = this.global.fee.dibawah_100k;
        total_bayar = this.form_create.value.harga_barang + fee;
      } else if (this.form_create.value.harga_barang > 100000) {
        let hitung =
          Math.ceil(this.form_create.value.harga_barang / 100000) - 1;
        fee =
          this.global.fee.dibawah_100k +
          hitung * this.global.fee.kelipatan_100k;
        total_bayar = this.form_create.value.harga_barang + fee;
      }
      // End Get Fee

      this.api
        .createTransaction({
          form: this.form_create.value,
          total_bayar: total_bayar,
          fee: fee,
        })
        .then(
          (res) => {
            this.loadingCreate = false;
            this.router.navigate(['/user/transaksi', res.id]);
          },
          (error) => {
            this.msgError =
              'Terjadi kesalahan tidak dapat membuat transaksi baru.';
          }
        );
    }
  }
}
