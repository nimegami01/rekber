import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.css'],
})
export class AddBankComponent implements OnInit {
  bankList = [
    {
      name: 'OVO',
      type: 'E-Wallet',
    },
    {
      name: 'DANA',
      type: 'E-Wallet',
    },
    {
      name: 'BRI',
      type: 'BANK',
    },
    {
      name: 'BNI',
      type: 'BANK',
    },
    {
      name: 'BCA',
      type: 'BANK',
    },
  ];

  constructor(private api: ApiService, private toastr: ToastrService) {}

  bankListUser = [];
  loading = true;
  ngOnInit(): void {
    this.api.getBankList().onSnapshot(async (res) => {
      this.loading = true;
      this.bankListUser = [];
      res.forEach(async (a) => {
        this.bankListUser.push({ id: a.id, data: a.data() });
      });
      this.loading = false;
    });
  }

  bankInfo = new FormControl('');
  rekBank = new FormControl('');
  namaUser = new FormControl('');

  sukses = false;
  gagal = false;
  tambahRek() {
    this.sukses = false;
    this.gagal = false;
    if (this.bankInfo.value && this.rekBank.value && this.namaUser.value) {
      const bank = this.bankList[this.bankInfo.value];
      this.api
        .addBank({
          BankName: bank.name,
          BankType: bank.type,
          name: this.namaUser.value,
          bankRek: this.rekBank.value,
        })
        .then((res) => {
          this.sukses = true;
        })
        .catch(() => {
          this.gagal = true;
        });
    }
  }

  loadingDelete = false;
  deleteBank(id: any) {
    this.loadingDelete = true;
    this.api
      .deleteBank(id)
      .then((res) => {
        this.toastr.success('', 'Sukses Hapus Rekening', {
          tapToDismiss: true,
          positionClass: 'toast-bottom-center',
          timeOut: 3000,
        });
        this.loadingDelete = false;
      })
      .catch((err) => {
        this.toastr.error(
          'Silahkan cek koneksi anda.',
          'Error Saat Hapus Rekening Bank',
          {
            tapToDismiss: true,
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          }
        );
        this.loadingDelete = false;
      });
  }
}
