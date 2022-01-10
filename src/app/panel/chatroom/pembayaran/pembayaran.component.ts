import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from '../../../api/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pembayaran',
  templateUrl: './pembayaran.component.html',
  styleUrls: ['./pembayaran.component.css'],
})
export class PembayaranComponent implements OnInit {
  constructor(
    public bsModalRef: BsModalRef,
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  loading = true;

  transaksi: any;

  pembayaran_field = true;
  pembayaran_list = [];

  statusPembayaran = 0;
  ngOnInit(): void {
    // Status pembayaran
    // 1 = pending, 2 = sukses, 0 = gagal
    setTimeout(() => {
      this.api.cekPembayaran(this.transaksi.id).onSnapshot(async (res: any) => {
        this.loading = true;
        this.pembayaran_field = true;
        this.pembayaran_list = [];
        let i = 0;
        res.forEach(async (doc: any) => {
          if (i == 0) {
            this.statusPembayaran = doc.data().statusPembayaran;
          }
          if (
            doc.data().statusPembayaran == 1 ||
            doc.data().statusPembayaran == 2
          ) {
            this.pembayaran_field = false;
          }
          this.pembayaran_list.push(doc.data());
          i++;
        });
        this.loading = false;
      });
    }, 200);
  }

  imagePreview = [];
  imageFile = [];
  imageSelected(event: any) {
    if (this.pembayaran_field && !this.loading) {
      const maxUpload = 4;
      let error_notif = false;
      if (this.imagePreview.length + event.target.files.length >= maxUpload) {
        this.toastr.error(
          'Maksimal upload 3 gambar.',
          'Upload terlalu banyak',
          {
            tapToDismiss: true,
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          }
        );
        error_notif = true;
      }

      if (event.target.files.length >= maxUpload) {
        if (!error_notif) {
          this.toastr.error(
            'Maksimal upload 3 gambar.',
            'Upload terlalu banyak',
            {
              tapToDismiss: true,
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            }
          );
        }
      }
      if (event.target.files) {
        let num = this.imagePreview.length;
        for (let i = 0; i < event.target.files.length; i++) {
          num++;
          if (num >= maxUpload) {
            break;
          }

          this.imageFile.push(event.target.files[i]);

          let reader = new FileReader();
          reader.readAsDataURL(event.target.files[i]);

          reader.onload = (event) => {
            this.imagePreview.push(event.target.result);
          };
        }
      }
    }
  }

  removeImageFromList(num: number) {
    let lengImg = this.imagePreview.length;
    let tempImgPreview = this.imagePreview;
    let tempImgFile = this.imageFile;
    this.imagePreview = [];
    this.imageFile = [];
    for (let i = 0; i < lengImg; i++) {
      if (i != num) {
        this.imagePreview.push(tempImgPreview[i]);
        this.imageFile.push(tempImgFile[i]);
      }
    }
  }

  loadingImage: Boolean;
  pesanPembayaran = new FormControl('');
  async kirim() {
    this.loadingImage = true;

    let images: any;

    images = [];

    if (this.imagePreview.length > 0) {
      images = await this.api.pushFileToStorage(this.imageFile, 'uploads');
      this.imagePreview = [];
      this.imageFile = [];
      this.loadingImage = false;
    }

    try {
      this.api.kirimPembayaran(
        this.transaksi.id,
        this.pesanPembayaran.value,
        images
      );
      this.pesanPembayaran.setValue('');
      try {
        this.api.addPesanSistem(
          this.transaksi.id,
          'Pembeli mengirim bukti pembayaran, silahkan tunggu sampai admin melakukan verifikasi.'
        );
      } catch {}
    } catch {
      this.toastr.error(
        'Silahkan cek koneksi anda.',
        'Bukti pembayaran tidak terkirim.',
        {
          tapToDismiss: true,
          positionClass: 'toast-bottom-center',
          timeOut: 3000,
        }
      );
    }

    this.loadingImage = false;
  }
}
