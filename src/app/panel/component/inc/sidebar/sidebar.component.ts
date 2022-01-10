import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(
    private api: ApiService,
    public global: GlobalVariableService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  sidebarToggleStatus: boolean;

  adminMenu = false;
  ngOnInit(): void {
    this.api.getUserData_().then((res) => {
      res.forEach((doc) => {
        if (doc.data().role == 2) {
          this.adminMenu = true;
        }
      });
    });
    // Sidebar Toggle
    const el2 = this.el.nativeElement.querySelector('.navbar-nav');
    if (window.innerWidth < 768) {
      el2.classList.add('toggled');
      this.renderer.addClass(document.body, 'sidebar-toggled');
      this.renderer.removeClass(document.body, 'sidebar-show');
      this.sidebarToggleStatus = true;
    }

    if (el2.classList.contains('toggled')) {
      this.sidebarToggleStatus = false;
      this.renderer.removeClass(document.body, 'sidebar-show');
    } else {
      this.sidebarToggleStatus = true;
      this.renderer.addClass(document.body, 'sidebar-show');
    }

    // Observabel
    this.global.sidebarToggle$.subscribe((res) => {
      const el = this.el.nativeElement.querySelector('.navbar-nav');
      if (el.classList.contains('toggled')) {
        el.classList.remove('toggled');
        this.renderer.removeClass(document.body, 'sidebar-toggled');
        this.renderer.addClass(document.body, 'sidebar-show');
        this.sidebarToggleStatus = true;
      } else {
        el.classList.add('toggled');
        this.renderer.addClass(document.body, 'sidebar-toggled');
        this.renderer.removeClass(document.body, 'sidebar-show');
        this.sidebarToggleStatus = false;
      }
    });
  }

  toggleSidebar() {
    this.global.sidebarToggle();
  }
}
