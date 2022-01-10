import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ApiGuardService } from '../api/api-guard.service';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private apiGuard: ApiGuardService) {}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      let checkUserLogin = await this.apiGuard.userLogin();
      if (checkUserLogin) {
        try {
          const role = this.apiGuard.userAdministrator();
          return role;
        } catch {
          this.router.navigate(['/user/dashboard']);
          return false;
        }
      } else {
        this.router.navigate(['/user/dashboard']);
        return false;
      }
    } catch {
      return false;
    }
  }
}
