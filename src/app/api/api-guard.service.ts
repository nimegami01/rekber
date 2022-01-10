import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiGuardService {
  constructor(private api: ApiService) {}

  async checkUserVerify() {
    return (await this.api.authState()).emailVerified;
  }

  async userLogin() {
    return await this.api.authState();
  }

  async userAdministrator() {
    try {
      const user = await this.api.getUserData_();
      let data: any;
      user.forEach((doc) => {
        data = doc.data();
      });
      if (data.role == '2') {
        return true;
      }
    } catch {
      return false;
    }
  }
}
