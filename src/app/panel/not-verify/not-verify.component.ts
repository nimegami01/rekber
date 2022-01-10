import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiAuthService } from 'src/app/api/api-auth.service';
import { ApiService } from 'src/app/api/api.service';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';

@Component({
  selector: 'app-not-verify',
  templateUrl: './not-verify.component.html',
  styleUrls: ['./not-verify.component.css'],
})
export class NotVerifyComponent implements OnInit {
  constructor(
    private apiAuth: ApiAuthService,
    private api: ApiService,
    private router: Router,
    private global: GlobalVariableService
  ) {}

  userInfo: any;
  ngOnInit(): void {
    const _this = this;
    const uid = localStorage.getItem('uid');
    // Get Data Profile
    this.global.userProfile().then((res) => {
      this.userInfo = res;
    });
  }

  message: any;
  statusMsg = false;
  async sendVerify() {
    try {
      await this.apiAuth.sendEmailVerification();
      this.message =
        'Link Verifikasi berhasil dikirim' +
        (this.userInfo.email ? ' ke email ' + this.userInfo.email : '') +
        '.';
      this.statusMsg = true;
    } catch (error) {
      this.statusMsg = false;
      this.message = error.message;
    }
  }

  logout() {
    this.api.logout().then(
      () => {
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  refresh() {
    location.reload();
  }
}
