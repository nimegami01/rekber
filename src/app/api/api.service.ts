import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize, first } from 'rxjs/operators';
import 'firebase/firestore';

import * as moment from 'moment';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.userId();
  }

  logout() {
    return this.afAuth.signOut();
  }

  async authState() {
    return await this.afAuth.authState.pipe(first()).toPromise();
  }

  async userId() {
    try {
      const uid = (await this.authState()).uid;
      localStorage.setItem('uid', uid);
    } catch {}
  }

  async getUserData_() {
    const uid = localStorage.getItem('uid');
    return await this.afs.firestore
      .collection('user')
      .where('uid', '==', uid)
      .get();
  }

  // Get current user with id
  getCurrentUserWithId(uid: any) {
    return this.afs.firestore.collection('user').where('uid', '==', uid).get();
  }

  // Get current user with email
  getCurrentUserWithEmail(email: any) {
    return this.afs.firestore
      .collection('user')
      .where('email', '==', email)
      .get();
  }

  // Get Website Settings
  async getWebsiteSettings() {
    return await this.afs.firestore.collection('website').doc('settings').get();
  }

  // Get Duration Settings
  async getDurationSettings() {
    return await this.afs.firestore
      .collection('website')
      .doc('duration_settings')
      .get();
  }

  // Bank list

  async addBank(data: any) {
    const uid = localStorage.getItem('uid');
    return await this.afs.firestore.collection('user_bank_list').add({
      name: data.BankName,
      type: data.BankType,
      uid: uid,
      username: data.name,
      value: data.bankRek,
    });
  }

  getBankList() {
    const uid = localStorage.getItem('uid');
    return this.afs.firestore
      .collection('user_bank_list')
      .where('uid', '==', uid);
  }

  deleteBank(id: any) {
    return this.afs.firestore.collection('user_bank_list').doc(id).delete();
  }

  // Get Current Bank
  async getCurrentBank(id_bank: any) {
    return await this.afs.firestore
      .collection('user_bank_list')
      .doc(id_bank)
      .get();
  }

  // Create Transaction
  async createTransaction(data: any) {
    const uid = localStorage.getItem('uid');

    const date_now = moment().unix();

    let add_transaksi = await this.afs.firestore
      .collection('transaksi_list')
      .add({
        judul: data.form.judul,
        nama_barang: data.form.nama_barang,
        jenis_barang: data.form.jenis_barang,
        harga: data.form.harga_barang,
        durasi: data.form.duration,
        deskripsi_barang: data.form.deskripsi,
        syarat_trx_selesai: data.form.syarat,
        id_rek_user: data.form.id_akun_rek,
        uid_penjual: uid,
        uid_pembeli: '',
        expired: '',
        create: date_now,
        fee: data.fee,
        total_bayar: data.total_bayar,
        persetujuan_pembeli: false,
        persetujuan_penjual: false,
        update: date_now,
        id_transaksi: '',
        status: 'active',
      });

    await this.afs.firestore
      .collection('transaksi_list')
      .doc(add_transaksi.id)
      .update({
        id: add_transaksi.id,
      });

    await this.afs.firestore.collection('riwayat_pengeditan_transaksi').add({
      id: add_transaksi.id,
      judul: data.form.judul,
      nama_barang: data.form.nama_barang,
      jenis_barang: data.form.jenis_barang,
      harga: data.form.harga_barang,
      durasi: data.form.duration,
      deskripsi_barang: data.form.deskripsi,
      syarat_trx_selesai: data.form.syarat,
      id_rek_user: data.form.id_akun_rek,
      uid_penjual: uid,
      uid_pembeli: '',
      create: date_now,
      expired: '',
      status: 'active',
      fee: data.fee,
      total_bayar: data.total_bayar,
      persetujuan_pembeli: false,
      persetujuan_penjual: false,
      update: date_now,
      pengeditan: { action: 'create', date: date_now },
    });

    return add_transaksi;
  }

  updateStatusTransaksi(action: any, statusText: any, id: any) {
    return this.afs.firestore.collection('transaksi_list').doc(id).update({
      status: action,
      statusText: statusText,
    });
  }

  // Get All Transaksi
  getAlltransaction() {
    return this.afs.firestore
      .collection('transaksi_list')
      .orderBy('create', 'desc');
  }

  // Get Current Transaksi
  getCurrentTransaction(id_transaksi: any) {
    return this.afs.firestore
      .collection('transaksi_list')
      .where('id', '==', id_transaksi);
  }

  // Get Transaksi dengan ID
  getTransactionWithID(id_transaksi: any) {
    return this.afs.firestore
      .collection('transaksi_list')
      .where('id', '==', id_transaksi);
  }

  // SendChat
  sendChat(data: any) {
    const uid = localStorage.getItem('uid');

    const date_now = moment().unix();

    return this.afs.firestore.collection('chat_list').add({
      uid: uid,
      transaksi_id: data.transaksi_id,
      pesan: data.pesan,
      image: data.images,
      date: date_now,
      status: 'show',
      pesan_sistem: '',
      role: data.role,
    });
  }

  async sendChatNotif(chatid: any, notif: any) {
    await this.afs.firestore.collection('chat_list').doc(chatid).update({
      notif: notif,
    });
  }

  async statusChat(chatid: any, status: any) {
    await this.afs.firestore.collection('chat_list').doc(chatid).update({
      status: status,
    });
  }

  getCurrentChat(chatid: any) {
    return this.afs.firestore.collection('chat_list').doc(chatid);
  }

  // Add Pesan sistem
  async addPesanSistem(transaksi_id: any, pesan: any) {
    const date_now = moment().unix();

    return this.afs.firestore.collection('chat_list').add({
      transaksi_id: transaksi_id,
      pesan: pesan,
      date: date_now,
      status: 'show',
      role: 'system',
      pesan_sistem: '',
    });
  }

  // Get Chat
  getChat(data: any) {
    return this.afs.firestore
      .collection('chat_list')
      .where('transaksi_id', '==', data.id_transaksi)
      .orderBy('date', 'asc');
  }

  // Upload File ke Storage
  pushFileToStorage(images: File[], title: string) {
    return new Promise((resolve, reject) => {
      const urls: string[] = [];
      for (const file of images) {
        const path = `${title}/${Date.now()}_${file.name}`;
        const ref = this.storage.ref(path);
        const task = this.storage.upload(path, file);

        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              ref.getDownloadURL().subscribe((url) => {
                urls.push(url);

                if (images.length === urls.length) {
                  resolve(urls);
                }
              });
            })
          )
          .subscribe();
      }
    });
  }

  // Undang pembeli
  undangPembeli(data: any) {
    const date_now = moment().unix();
    return this.afs.firestore.collection('undangan_ke_pembeli').add({
      id_transaksi: data.id_transaksi,
      uid_penjual: data.uid_penjual,
      uid_pembeli: data.uid_pembeli,
      date: date_now,
      status: 0,
    });
  }

  // Cek undang pembeli
  cekUndangPembeli(id_transaksi: any) {
    return this.afs.firestore
      .collection('undangan_ke_pembeli')
      .where('id_transaksi', '==', id_transaksi)
      .orderBy('date', 'desc');
  }

  // Cek batal Undang pembeli
  aksiUndangPembeli(doc_id: any, action: number) {
    return this.afs.firestore
      .collection('undangan_ke_pembeli')
      .doc(doc_id)
      .update({
        status: action,
      });
  }

  ambilUndangan() {
    return this.afs.firestore
      .collection('undangan_ke_pembeli')
      .orderBy('date', 'desc');
  }

  ambilUndanganWithId(id: any) {
    return this.afs.firestore.collection('undangan_ke_pembeli').doc(id);
  }

  aksiUndangan(action: any, id: any, id_transaksi: any, days: number) {
    const uid = localStorage.getItem('uid');
    const date_now = moment().unix();
    const expired = moment().add(days, 'd').unix();
    if (action == 1) {
      this.afs.collection('transaksi_list').doc(id_transaksi).update({
        uid_pembeli: uid,
        expired: expired,
        statusText: 'Open',
      });
    }
    this.afs.collection('undangan_ke_pembeli').doc(id).update({
      status: action,
      updateAction: date_now,
    });
  }

  // Req Perpanjang Transaksi

  reqPerpanjangTransaksi(id: any, alasan: any, uid: any, durasi: any) {
    const date_now = moment().unix();
    return this.afs.firestore.collection('tambah_durasi_transaksi').add({
      id_transaksi: id,
      date: date_now,
      alasan: alasan,
      uid: uid,
      add_durasi: durasi,
      status: 0,
    });
  }

  // Batal transaksi
  actionPerpanjangTransaksi(id: any, action: number) {
    return this.afs.firestore
      .collection('tambah_durasi_transaksi')
      .doc(id)
      .update({
        status: action,
      });
  }

  cekPerpanjangTransaksi(id: any) {
    return this.afs.firestore
      .collection('tambah_durasi_transaksi')
      .where('id_transaksi', '==', id)
      .orderBy('date', 'desc');
  }

  // Transaksi selesai
  transaksiSelesai(id: any, role: any) {
    if (role == 'Pembeli') {
      return this.afs.firestore
        .collection('transaksi_list')
        .doc(id)
        .update({ persetujuan_pembeli: true });
    } else if (role == 'Penjual') {
      return this.afs.firestore
        .collection('transaksi_list')
        .doc(id)
        .update({ persetujuan_penjual: true });
    } else {
      return null;
    }
  }

  // Pembatalan transaksi
  reqPembatalanTransaksi(id: any, role: any) {
    const date_now = moment().unix();
    const uid = localStorage.getItem('uid');
    return this.afs.firestore.collection('req_pembatalan_transaksi').add({
      id_transaksi: id,
      uid: uid,
      role: role,
      status: 0,
      date: date_now,
    });
  }

  aksiPembatalanTransaksi(id: any, action: number) {
    const date_now = moment().unix();
    const uid = localStorage.getItem('uid');
    return this.afs.firestore
      .collection('req_pembatalan_transaksi')
      .doc(id)
      .update({ status: action });
  }

  cekPembatalanTransaksi(id: any) {
    return this.afs.firestore
      .collection('req_pembatalan_transaksi')
      .where('id_transaksi', '==', id);
  }

  // Cek batal Undang pembeli
  getAllTransaksi() {
    return this.afs.firestore
      .collection('transaksi_list')
      .orderBy('create', 'desc');
  }

  // Get Kirim Barang
  getKirimBarang(id: any) {
    return this.afs.firestore
      .collection('barang_transaksi')
      .where('id_transaksi', '==', id)
      .orderBy('date', 'desc');
  }

  // Tambah Kirim Barang
  addKirimBarang(id: any, barang: any, alasan: any) {
    const date_now = moment().unix();
    const uid = localStorage.getItem('uid');
    return this.afs.firestore.collection('barang_transaksi').add({
      id_transaksi: id,
      uid: uid,
      info_barang: barang,
      alasan: alasan,
      date: date_now,
    });
  }

  // Kirim pembayaran

  kirimPembayaran(id: any, pesan: any, gambar: any) {
    const date_now = moment().unix();
    const uid = localStorage.getItem('uid');
    return this.afs.firestore.collection('list_pembayaran').add({
      id_transaksi: id,
      uid: uid,
      pesan: pesan,
      gambar: gambar,
      statusPembayaran: 1,
      date: date_now,
    });
  }

  // Cek pembayaran

  cekPembayaran(id: any) {
    return this.afs.firestore
      .collection('list_pembayaran')
      .where('id_transaksi', '==', id)
      .orderBy('date', 'desc');
  }

  // REKBER API

  // Get Bank list
  // async getBankListRekber() {
  //   return await this.afs.firestore
  //     .collection('rekber_bank_list')
  //     .orderBy('type', 'asc')
  //     .get();
  // }

  // Semua Pembayaran

  semuaPembayaran(status = 1) {
    return this.afs.firestore
      .collection('list_pembayaran')
      .where('statusPembayaran', '==', status)
      .orderBy('date', 'asc');
  }

  actionPembayaran(action: number, id: any) {
    return this.afs.firestore.collection('list_pembayaran').doc(id).update({
      statusPembayaran: action,
    });
  }
}
