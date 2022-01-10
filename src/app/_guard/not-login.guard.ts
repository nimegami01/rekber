import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiGuardService } from '../api/api-guard.service';

@Injectable({
  providedIn: 'root',
})
export class NotLoginGuard implements CanActivate {
  constructor(private apiGuard: ApiGuardService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      let checkUserLogin = await this.apiGuard.userLogin();
      if (checkUserLogin) {
        try {
          let checkUserVerify = await this.apiGuard.checkUserVerify();
          if (checkUserVerify) {
            // Email Verified
            this.router.navigate(['/user/dashboard']);
            return true;
          } else {
            // Email Not Verified
            this.router.navigate(['/user/not-verify']);
            return false;
          }
        } catch {
          return false;
        }
      } else {
        return true;
      }
    } catch {
      return false;
    }
  }
}
