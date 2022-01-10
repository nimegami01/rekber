import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { ApiGuardService } from '../api/api-guard.service';

@Injectable({
  providedIn: 'root',
})
export class NotVerifyGuard implements CanActivate {
  constructor(private apiGuard: ApiGuardService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      let checkUserLogin = await this.apiGuard.userLogin();
      if (checkUserLogin) {
        try {
          let checkUserLogin = await this.apiGuard.checkUserVerify();
          if (checkUserLogin) {
            // Email Verified
            this.router.navigate(['/user/dashboard']);
            return false;
          } else {
            // Email Not Verified
            return true;
          }
        } catch {
          return false;
        }
      } else {
        this.router.navigate(['/auth/login']);
      }
    } catch {
      return false;
    }
  }
}
