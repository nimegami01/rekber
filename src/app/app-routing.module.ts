import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainAuthComponent } from './auth/main-auth/main-auth.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddBankComponent } from './panel/add-bank/add-bank.component';
import { AdminChatInfoComponent } from './panel/admin/admin-chat-info/admin-chat-info.component';
import { ReqTransaksiSelesaiComponent } from './panel/admin/req-transaksi-selesai/req-transaksi-selesai.component';
import { SemuaTrxComponent } from './panel/admin/semua-trx/semua-trx.component';
import { TidakAdaHalamanComponent } from './panel/admin/tidak-ada-halaman/tidak-ada-halaman.component';
import { ChatroomComponent } from './panel/chatroom/chatroom/chatroom.component';
import { CreateChatroomComponent } from './panel/chatroom/create-chatroom/create-chatroom.component';
import { DashboardComponent } from './panel/dashboard/dashboard.component';
import { MainPanelComponent } from './panel/main-panel/main-panel.component';
import { NotVerifyComponent } from './panel/not-verify/not-verify.component';
import { SearchComponent } from './panel/search/search.component';
import { UndanganListComponent } from './panel/undangan-list/undangan-list.component';
import { UndanganComponent } from './panel/undangan/undangan.component';
import { ValidasiPembayaranComponent } from './panel/validasi-pembayaran/validasi-pembayaran.component';
import { AdminGuard } from './_guard/admin.guard';
import { LoginGuard } from './_guard/login.guard';
import { NotLoginGuard } from './_guard/not-login.guard';
import { NotVerifyGuard } from './_guard/not-verify.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: MainAuthComponent,
    canActivate: [NotLoginGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: 'user',
    component: MainPanelComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'list/:id',
        canActivate: [LoginGuard],
        component: SearchComponent,
      },
      {
        path: 'undangan',
        canActivate: [LoginGuard],
        children: [
          {
            path: 'list',
            component: UndanganListComponent,
          },
          {
            path: 'info/:id',
            component: UndanganComponent,
          },
        ],
      },
      {
        path: 'transaksi-baru',
        component: CreateChatroomComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'transaksi/:id',
        component: ChatroomComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'add-bank',
        component: AddBankComponent,
        canActivate: [LoginGuard],
      },

      {
        path: 'not-verify',
        component: NotVerifyComponent,
        canActivate: [NotVerifyGuard],
      },
    ],
  },
  {
    path: 'admin',
    component: MainPanelComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'validasi-pembayaran',
        component: ValidasiPembayaranComponent,
      },
      {
        path: 'admin-chat/:id',
        component: AdminChatInfoComponent,
      },
      {
        path: 'semua-transaksi/:id',
        component: SemuaTrxComponent,
      },
      {
        path: 'req-trx-selesai',
        component: ReqTransaksiSelesaiComponent,
      },
      {
        path: 'req-pembatalan',
        component: TidakAdaHalamanComponent,
      },
      {
        path: 'req-perpanjang',
        component: TidakAdaHalamanComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
