import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './panel/dashboard/dashboard.component';
import { MainAuthComponent } from './auth/main-auth/main-auth.component';
import { MainPanelComponent } from './panel/main-panel/main-panel.component';

// 1. Import the libs you need
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NavbarComponent } from './panel/component/inc/navbar/navbar.component';
import { SidebarComponent } from './panel/component/inc/sidebar/sidebar.component';
import { FooterComponent } from './panel/component/inc/footer/footer.component';
import { NotVerifyComponent } from './panel/not-verify/not-verify.component';
import { ChatroomComponent } from './panel/chatroom/chatroom/chatroom.component';
import { CreateChatroomComponent } from './panel/chatroom/create-chatroom/create-chatroom.component';
import { KirimBarangModalComponent } from './panel/chatroom/kirim-barang-modal/kirim-barang-modal.component';
import { InfoModalComponent } from './panel/chatroom/info-modal/info-modal.component';
import { PengaturanModalComponent } from './panel/chatroom/pengaturan-modal/pengaturan-modal.component';
import { LoadingComponent } from './_global_component/loading/loading.component';
import { ConvertIdrPipe } from './_pipes/convert-idr.pipe';
import { BiayaAdminPipe } from './_pipes/biaya-admin.pipe';
import { ConvertDatePipe } from './_pipes/convert-date.pipe';
import { SecondToDatePipe } from './_pipes/second-to-date.pipe';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { ConvertToAgoPipe } from './_pipes/convert-to-ago.pipe';
import { SearchComponent } from './panel/search/search.component';
import { UndanganComponent } from './panel/undangan/undangan.component';
import { UndanganListComponent } from './panel/undangan-list/undangan-list.component';
import { LihatBarangComponent } from './panel/chatroom/lihat-barang/lihat-barang.component';
import { PembayaranComponent } from './panel/chatroom/pembayaran/pembayaran.component';
import { ModalExpiredComponent } from './panel/chatroom/modal-expired/modal-expired.component';
import { AddBankComponent } from './panel/add-bank/add-bank.component';
import { ValidasiPembayaranComponent } from './panel/validasi-pembayaran/validasi-pembayaran.component';
import { AdminChatInfoComponent } from './panel/admin/admin-chat-info/admin-chat-info.component';
import { ChatActionComponent } from './panel/admin/modal/chat-action/chat-action.component';
import { SemuaTrxComponent } from './panel/admin/semua-trx/semua-trx.component';
import { TidakAdaHalamanComponent } from './panel/admin/tidak-ada-halaman/tidak-ada-halaman.component';
import { ReqTransaksiSelesaiComponent } from './panel/admin/req-transaksi-selesai/req-transaksi-selesai.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    MainAuthComponent,
    MainPanelComponent,
    ResetPasswordComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    NotVerifyComponent,
    ChatroomComponent,
    CreateChatroomComponent,
    KirimBarangModalComponent,
    InfoModalComponent,
    PengaturanModalComponent,
    LoadingComponent,
    ConvertIdrPipe,
    BiayaAdminPipe,
    ConvertDatePipe,
    SecondToDatePipe,
    ConvertToAgoPipe,
    SearchComponent,
    UndanganComponent,
    UndanganListComponent,
    LihatBarangComponent,
    PembayaranComponent,
    ModalExpiredComponent,
    AddBankComponent,
    ValidasiPembayaranComponent,
    AdminChatInfoComponent,
    ChatActionComponent,
    SemuaTrxComponent,
    TidakAdaHalamanComponent,
    ReqTransaksiSelesaiComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ModalModule.forRoot(),
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatProgressBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
