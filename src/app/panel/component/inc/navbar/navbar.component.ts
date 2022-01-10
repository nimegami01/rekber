import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private api: ApiService,
    private router: Router,
    public global: GlobalVariableService
  ) {}

  username: any;
  userPicture: any;
  async ngOnInit() {
    await this.global.userProfile().then((res) => {
      this.username = res.fullName;
      this.userPicture = res.picture
        ? res.picture
        : this.global.image_profile_default;
    });
  }

  logout() {
    this.api.logout().then(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  toggleSidebar() {
    this.global.sidebarToggle();
  }
}
