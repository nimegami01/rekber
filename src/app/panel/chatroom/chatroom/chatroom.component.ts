import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/api/api.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { KirimBarangModalComponent } from '../kirim-barang-modal/kirim-barang-modal.component';
import { PengaturanModalComponent } from '../pengaturan-modal/pengaturan-modal.component';
import * as moment from 'moment';
import { FormControl, Validators } from '@angular/forms';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';
import { ToastrService } from 'ngx-toastr';
import { LihatBarangComponent } from '../lihat-barang/lihat-barang.component';
import { PembayaranComponent } from '../pembayaran/pembayaran.component';
import { ModalExpiredComponent } from '../modal-expired/modal-expired.component';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})
export class ChatroomComponent implements OnInit {
  @ViewChild('scrollMessage') private scrollMessage: ElementRef;

  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    public global: GlobalVariableService,
    private toastr: ToastrService
  ) {}

  form_pesan = new FormControl('');

  screenWidth: any;
  screenHeight: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  id_transaksi: any;
  current_uid: any;
  async ngOnInit() {
    await this.getProfile();

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.activatedRoute.params.subscribe((params) => {
      this.current_uid = localStorage.getItem('uid');

      this.id_transaksi = params['id'];
      this.get_all_transaksi();
      this.get_current_transaksi(this.id_transaksi);
      this.undanganPenjualChecker(this.id_transaksi);

      // Default Variable
      this.inputPembeliMsg = '';
      this.inputPembeliMsgStatus = false;
      this.form_pesan.setValue('');
      this.inputPembeli.setValue('');
      this.currentRole = '';
    });
  }

  current_transaksi: any;
  expired_cooldown: any;
  intervalExpired: any;
  expired_cooldown_show = true;
  uid_penjual: any;
  uid_pembeli: any;
  currentRole: any;
  loadingCurrentTransaksi = true;
  pembeli_valid = false;
  modalExpired = false;
  async get_current_transaksi(id: any) {
    this.modalExpired = false;
    clearInterval(this.intervalExpired);
    this.current_transaksi = '';
    this.currentRole = '';
    this.uid_pembeli = '';
    this.uid_penjual = '';
    this.pembeli_valid = false;
    this.loadingCurrentTransaksi = true;
    this.api.getCurrentTransaction(id).onSnapshot(async (res) => {
      this.loadingCurrentTransaksi = true;
      res.forEach((doc) => {
        if (
          doc.data().uid_pembeli == this.current_uid ||
          doc.data().uid_penjual == this.current_uid
        ) {
          this.current_transaksi = doc.data();
        }
      });
      // uid penjual
      this.uid_penjual = this.current_transaksi.uid_penjual;
      await this.getInfoPenjual(this.uid_penjual);

      // uid pembeli
      this.uid_pembeli = this.current_transaksi.uid_pembeli;
      await this.getInfoPembeli(this.uid_pembeli);
      if (this.uid_pembeli) {
        this.api.getCurrentUserWithId(this.uid_pembeli).then((res_) => {
          if (!res_.empty) {
            this.pembeli_valid = true;
          }
          // Loading
          this.loadingCurrentTransaksi = false;
        });
      } else {
        this.loadingCurrentTransaksi = false;
      }

      // Current
      if (this.uid_penjual == this.current_uid) {
        this.currentRole = 'Penjual';
      } else if (this.uid_pembeli == this.current_uid) {
        this.currentRole = 'Pembeli';
      }

      // Get Expired For Cooldown
      this.expired_cooldown = this.current_transaksi.expired - moment().unix();
      if (this.expired_cooldown) {
        this.intervalExpired = setInterval(() => {
          this.expired_cooldown = this.expired_cooldown - 1;
        }, 1000);
      }

      if (
        this.expired_cooldown <= 0 &&
        !this.modalExpired &&
        this.current_transaksi.status == 'active' &&
        this.current_transaksi.expired
      ) {
        this.modalExpired = true;
        let expiredModal = this.modalService.show(ModalExpiredComponent);
        expiredModal.content.userRole = this.currentRole;
      }

      // Get pesan
      if (this.uid_penjual && this.uid_pembeli) {
        await this.getPesan(this.id_transaksi);
      }
    });
  }

  all_transaksi: any;
  get_all_transaksi() {
    this.all_transaksi = '';
    this.api.getAlltransaction().onSnapshot((res) => {
      let data = [];
      res.forEach((doc) => {
        if (
          doc.data().uid_pembeli == this.current_uid ||
          doc.data().uid_penjual == this.current_uid
        ) {
          data.push({ data: doc.data(), id: doc.id });
        }
      });
      this.all_transaksi = data;
    });
  }

  chat_list = [];
  async getPesan(id: any) {
    this.chat_list = [];
    this.api.getChat({ id_transaksi: id }).onSnapshot(async (res) => {
      let tmp = this.chat_list.length;
      let result = [];
      res.forEach((doc) => {
        let profile: any;
        let roleTrx: any;
        if (doc.data().uid == this.uid_pembeli) {
          profile = this.infoPembeli;
          roleTrx = 'Pembeli';
        } else if (doc.data().uid == this.uid_penjual) {
          profile = this.infoPenjual;
          roleTrx = 'Penjual';
        }
        result.push({
          data: doc.data(),
          pesan_sensor: this.global.chatBruteForce(doc.data().pesan),
          id: doc.id,
          profile: profile,
          role_transaksi: roleTrx,
        });
      });
      this.chat_list = result;
      console.log(this.chat_list);

      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
      setTimeout(() => {
        this.scrollToBottom();
      }, 300);
    });
  }

  showChatSensor(i: number) {
    if (this.chat_list[i].pesan_sensor.show) {
      this.chat_list[i].pesan_sensor.show = false;
    } else {
      this.chat_list[i].pesan_sensor.show = true;
    }
  }

  loadingImage = false;
  async kirimPesan() {
    if (this.form_pesan.value.trim() || this.imagePreview.length) {
      const value = this.form_pesan.value;
      this.form_pesan.setValue('');

      let images: any;

      images = [];

      if (this.imagePreview.length > 0) {
        this.loadingImage = true;
        images = await this.api.pushFileToStorage(this.imageFile, 'uploads');
        this.imagePreview = [];
        this.imageFile = [];
        this.loadingImage = false;
      }

      try {
        this.form_pesan.setValue('');
        await this.api.sendChat({
          pesan: value,
          transaksi_id: this.id_transaksi,
          images: images,
          role: this.currentRole,
        });
        this.form_pesan.setValue('');
      } catch (err) {
        this.toastr.error(
          'Silahkan cek koneksi anda.',
          'Pesan Tidak Terkirim',
          {
            tapToDismiss: true,
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          }
        );
      }
    }
  }

  infoPenjual = {
    email: '',
    picture: '',
    uid: '',
    role: 1,
    fullName: '',
  };
  async getInfoPenjual(uid: any) {
    try {
      let temp = await this.api.getCurrentUserWithId(uid);

      temp.forEach((doc) => {
        this.infoPenjual.email = doc.data().email;
        this.infoPenjual.picture = doc.data().picture
          ? doc.data().picture
          : this.global.image_profile_default;
        this.infoPenjual.uid = doc.data().uuid;
        this.infoPenjual.role = doc.data().role;
        this.infoPenjual.fullName = doc.data().fullName;
      });
    } catch {}
  }

  infoPembeli = {
    email: '',
    picture: '',
    uid: '',
    role: 1,
    fullName: '',
  };
  async getInfoPembeli(uid: any) {
    try {
      let temp = await this.api.getCurrentUserWithId(uid);

      temp.forEach((doc) => {
        this.infoPembeli.email = doc.data().email;
        this.infoPembeli.picture = doc.data().picture
          ? doc.data().picture
          : this.global.image_profile_default;
        this.infoPembeli.uid = doc.data().uuid;
        this.infoPembeli.role = doc.data().role;
        this.infoPembeli.fullName = doc.data().fullName;
      });
    } catch {}
  }

  imagePreview = [];
  imageFile = [];
  imageSelected(event: any) {
    const maxUpload = 11;
    let error_notif = false;
    if (this.imagePreview.length + event.target.files.length >= maxUpload) {
      this.toastr.error('Maksimal upload 10 gambar.', 'Upload terlalu banyak', {
        tapToDismiss: true,
        positionClass: 'toast-bottom-center',
        timeOut: 3000,
      });
      error_notif = true;
    }

    if (event.target.files.length >= maxUpload) {
      if (!error_notif) {
        this.toastr.error(
          'Maksimal upload 10 gambar.',
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

  userEmail: any;
  async getProfile() {
    await this.global.userProfile().then((res) => {
      this.userEmail = res.email;
    });
  }

  inputPembeli = new FormControl('', [Validators.email]);
  inputPembeliMsg: any;
  inputPembeliMsgStatus = false;
  loadingUndang = false;
  async undangPembeli() {
    this.loadingUndang = true;
    this.inputPembeliMsg = '';
    this.inputPembeliMsgStatus = false;
    if (this.inputPembeli.value) {
      if (!this.inputPembeli.invalid) {
        if (this.userEmail != this.inputPembeli.value) {
          try {
            let user = await this.api.getCurrentUserWithEmail(
              this.inputPembeli.value
            );
            if (user.empty) {
              this.inputPembeliMsg =
                'User tidak ditemukan. Pastikan user sudah mendaftar atau cek kembali email yang anda masukkan.';
            } else {
              let udgPembeli: any;
              user.forEach((doc) => {
                udgPembeli = doc.data().uid;
              });
              try {
                let cekUndangan = await this.api
                  .cekUndangPembeli(this.id_transaksi)
                  .get();

                try {
                  this.api.undangPembeli({
                    id_transaksi: this.id_transaksi,
                    uid_penjual: this.uid_penjual,
                    uid_pembeli: udgPembeli,
                  });
                  this.undanganPenjualChecker(this.id_transaksi);
                  this.inputPembeliMsgStatus = true;
                  this.inputPembeliMsg =
                    'Pembeli berhasil di undang, silahkan tunggu sampai pembeli menyetujui undangan anda.';
                } catch {
                  this.inputPembeliMsg =
                    'Gagal mengundang pembeli, silahkan ulangi lagi.';
                }
              } catch {
                this.inputPembeliMsg =
                  'Gagal mengundang pembeli, silahkan ulangi lagi.';
              }
            }
          } catch {
            this.inputPembeliMsg =
              'Gagal melakukan pengecekan user yang di undang, silahkan coba lagi..';
          }
        } else {
          this.inputPembeliMsg = 'Jangan undang diri sendiri gan.';
        }
      } else {
        this.inputPembeliMsg =
          'Format email tidak valid, silahkan cek kembali.';
      }
    }
    this.loadingUndang = false;
  }

  undangPembeliForm = true;
  infoUndangPembeli = [];
  loadingUndanganForm = true;
  async undanganPenjualChecker(id_transaksi: any) {
    this.undangPembeliForm = true;
    this.loadingUndanganForm = true;
    this.infoUndangPembeli = [];

    this.api.cekUndangPembeli(id_transaksi).onSnapshot(async (res) => {
      this.undangPembeliForm = true;
      this.loadingUndanganForm = true;
      let result = [];
      res.forEach((doc) => {
        if (doc.data().status == 0) {
          this.undangPembeliForm = false;
        }
        result.push({ data: doc.data(), id: doc.id });
      });
      let result_2 = [];
      for (let i = 0; i < result.length; i++) {
        let tmp: any;
        try {
          tmp = await this.api.getCurrentUserWithId(result[i].data.uid_pembeli);
          tmp.forEach((doc) => {
            result_2.push({
              data: result[i].data,
              id: result[i].id,
              profile: doc.data(),
            });
          });
        } catch {}
      }
      this.infoUndangPembeli = result_2;
      this.loadingUndanganForm = false;
    });
  }

  batalUndangErr: any;
  batalUndangPembeli(id: any) {
    this.batalUndangErr = '';
    this.api.aksiUndangPembeli(id, 3);
  }

  kirimBarang: BsModalRef;
  kirimBarangModal() {
    this.kirimBarang = this.modalService.show(KirimBarangModalComponent);
    this.kirimBarang.content.transaksi = this.current_transaksi;
  }

  bayar: BsModalRef;
  bayarModal() {
    this.bayar = this.modalService.show(PembayaranComponent);
    this.bayar.content.transaksi = this.current_transaksi;
  }

  lihatBarang: BsModalRef;
  lihatBarangModal() {
    this.lihatBarang = this.modalService.show(LihatBarangComponent);
    this.lihatBarang.content.transaksi = this.current_transaksi;
  }

  modalInfo: BsModalRef;
  infoModal() {
    this.modalInfo = this.modalService.show(InfoModalComponent);
    this.modalInfo.content.data = this.current_transaksi;
    this.modalInfo.content.InfoPenjual = this.infoPenjual;
    this.modalInfo.content.InfoPembeli = this.infoPembeli;
    this.modalInfo.content.current_role = this.currentRole;
  }

  modalPengaturan: BsModalRef;
  pengaturanModal() {
    this.modalPengaturan = this.modalService.show(PengaturanModalComponent);
    this.modalPengaturan.content.id_transaksi = this.id_transaksi;
    this.modalPengaturan.content.current_transaksi = this.current_transaksi;
    this.modalPengaturan.content.uid = this.current_uid;
    this.modalPengaturan.content.current_role = this.currentRole;
    if (
      this.uid_pembeli &&
      this.uid_penjual &&
      this.current_transaksi.status == 'active'
    ) {
      this.modalPengaturan.content.transaksiChecker = true;
    } else {
      this.modalPengaturan.content.transaksiChecker = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollMessage.nativeElement.scrollTop =
        this.scrollMessage.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngOnDestroy() {}
}
