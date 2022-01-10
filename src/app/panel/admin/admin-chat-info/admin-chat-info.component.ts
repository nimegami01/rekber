import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api/api.service';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';
import * as moment from 'moment';
import { InfoModalComponent } from '../../chatroom/info-modal/info-modal.component';
import { ChatActionComponent } from '../modal/chat-action/chat-action.component';
import { LihatBarangComponent } from '../../chatroom/lihat-barang/lihat-barang.component';

@Component({
  selector: 'app-admin-chat-info',
  templateUrl: './admin-chat-info.component.html',
  styleUrls: ['./admin-chat-info.component.css'],
})
export class AdminChatInfoComponent implements OnInit {
  @ViewChild('scrollMessage') private scrollMessage: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public global: GlobalVariableService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  id_transaksi: any;
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.id_transaksi = param['id'];
      this.chatList(param['id']);
      this.transaksiDetail(param['id']);
    });
  }

  modalExpired = false;
  expired_cooldown: any;
  intervalExpired: any;
  detail: any;
  transaksiDetail(id_transaksi: any) {
    this.api.getCurrentTransaction(id_transaksi).onSnapshot((res) => {
      res.forEach((doc) => {
        clearInterval(this.intervalExpired);
        this.detail = doc.data();
        this.getInfoPenjual(this.detail.uid_penjual);
        this.getInfoPembeli(this.detail.uid_pembeli);
        // Get Expired For Cooldown
        this.expired_cooldown = this.detail.expired - moment().unix();
        if (this.expired_cooldown && this.expired_cooldown > 0) {
          this.intervalExpired = setInterval(() => {
            this.expired_cooldown = this.expired_cooldown - 1;
          }, 1000);
        } else {
          this.expired_cooldown = 0;
          this.modalExpired = true;
        }
      });
      console.log(this.detail);
    });
  }

  chatListData = [];
  chatList(id: any) {
    this.api.getChat({ id_transaksi: id }).onSnapshot((res) => {
      let data = [];
      let i = 0;
      let tmp = this.chatListData.length;
      res.forEach((doc) => {
        data.push(doc.data());
        data[i]['chatid'] = doc.id;
        i++;
      });
      this.chatListData = data;
      // console.log(this.chatListData);
      if (this.chatListData.length > tmp) {
        setTimeout(() => {
          this.scrollToBottom();
        }, 50);
      }
    });
  }

  form_pesan = new FormControl('');
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
          role: 'admin',
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

  tutupSemuaImage() {
    this.imagePreview = [];
  }

  scrollToBottom(): void {
    try {
      this.scrollMessage.nativeElement.scrollTop =
        this.scrollMessage.nativeElement.scrollHeight;
    } catch (err) {}
  }

  modalInfo: BsModalRef;
  infoModal() {
    this.modalInfo = this.modalService.show(InfoModalComponent);
    this.modalInfo.content.data = this.detail;
    this.modalInfo.content.InfoPenjual = this.infoPenjual;
    this.modalInfo.content.InfoPembeli = this.infoPembeli;
    this.modalInfo.content.current_role = 'admin';
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

  modalAction: BsModalRef;
  actionModal(chatid: any) {
    this.modalAction = this.modalService.show(ChatActionComponent);
    this.modalAction.content.chatid = chatid;
  }

  loadingActionAdmin = false;
  actionAdmin(action: any) {
    this.loadingActionAdmin = true;
    let text = 'Sukses';
    if (action == 'failed') {
      text = 'Gagal';
    } else if (action == 'cancel') {
      text = 'Batal';
    } else if (action == 'active') {
      text = 'Open';
    }

    this.api
      .updateStatusTransaksi(action, text, this.id_transaksi)
      .then((res) => {
        this.loadingActionAdmin = false;
        this.toastr.success(
          'Update: status transaksi menjadi ' + text,
          'Sukses',
          {
            tapToDismiss: true,
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          }
        );
      })
      .catch((err) => {
        this.loadingActionAdmin = false;
        this.toastr.error(
          'Silahkan cek koneksi anda.',
          'Pesan Tidak Terkirim',
          {
            tapToDismiss: true,
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          }
        );
      });
  }

  lihatBarang: BsModalRef;
  lihatBarangModal() {
    this.lihatBarang = this.modalService.show(LihatBarangComponent);
    this.lihatBarang.content.transaksi = this.detail;
  }
}
