import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiAuthService } from 'src/app/api/api-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private apiAuth: ApiAuthService, private router: Router) {}

  ngOnInit(): void {}

  email = new FormControl('');
  password = new FormControl('');

  loginWithGoogle() {
    this.apiAuth.doGoogleLogin().then(
      (res) => {
        this.apiAuth.userUpdate({
          email: res.user.email,
          fullName: res.user.displayName,
          verifiedEmail: res.user.emailVerified,
          picture: res.user.photoURL,
          uid: res.user.uid,
        });
        localStorage.setItem('uid', res.user.uid);
        this.router.navigate(['/user/dashboard']);
      },
      (error) => {
        this.loginMsg = error.message;
      }
    );
  }

  loginMsg: any;
  loginStatus = false;
  loadingLogin = false;
  async loginWithEmailPass() {
    this.loadingLogin = true;
    this.loginMsg = '';
    if (this.email.value && this.password.value) {
      await this.apiAuth.login(this.email.value, this.password.value).then(
        (res) => {
          this.loginStatus = true;
          localStorage.setItem('uid', res.user.uid);
          if (!res.user.emailVerified) {
            this.router.navigate(['/user/not-verify']);
          } else {
            this.router.navigate(['/user/dashboard']);
          }
        },
        (error) => {
          this.loginStatus = false;
          this.loginMsg = error.message;
        }
      );
    }
    this.loadingLogin = false;
  }
}
