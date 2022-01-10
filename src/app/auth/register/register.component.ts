import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  EmailValidator,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiAuthService } from 'src/app/api/api-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private apiAuth: ApiAuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  formRegister = this.fb.group({
    namaLengkap: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    password: ['', [Validators.minLength(6), Validators.required]],
    passwordUlangi: ['', [Validators.minLength(6), Validators.required]],
  });

  get f() {
    return this.formRegister.controls;
  }

  namaLengkapDetect = false;
  emailDetect = false;
  passwordDetect = false;

  password = { primary: false, ulangi: false };

  ngOnInit(): void {}

  sendRegisterMsg: any;
  sendRegisterMsgStatus = false;
  registerLoading = false;
  registerWithEmailpass() {
    const password = this.formRegister.value.password;
    const email = this.formRegister.value.email;
    const namaLengkap = this.formRegister.value.namaLengkap;

    if (password && email && namaLengkap && !this.formRegister.invalid) {
      this.registerLoading = true;
      this.sendRegisterMsg = '';
      this.apiAuth
        .register({
          email: email,
          password: password,
        })
        .then(
          (res) => {
            this.registerLoading = false;
            this.sendRegisterMsgStatus = true;
            this.apiAuth.userUpdate({
              email: res.user.email,
              fullName: namaLengkap,
              verifiedEmail: res.user.emailVerified,
              picture: res.user.photoURL,
              uid: res.user.uid,
            });
            localStorage.setItem('uid', res.user.uid);
            if (!res.user.emailVerified) {
              this.router.navigate(['/user/not-verify']);
            } else {
              this.router.navigate(['/user/dashboard']);
            }
          },
          (error) => {
            this.registerLoading = false;
            this.sendRegisterMsgStatus = false;
            this.sendRegisterMsg = error.message;
          }
        );
    }
  }

  registerWithGoogle() {
    this.sendRegisterMsgStatus = false;
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
        this.sendRegisterMsg = error.message;
      }
    );
  }

  passwordMatch = true;

  keyupPassword() {
    if (this.formRegister.value.passwordUlangi) {
      if (
        this.formRegister.value.password !=
        this.formRegister.value.passwordUlangi
      ) {
        this.passwordMatch = false;
      } else {
        this.passwordMatch = true;
      }
    }
  }
}
