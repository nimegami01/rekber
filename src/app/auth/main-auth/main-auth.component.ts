import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-main-auth',
  templateUrl: './main-auth.component.html',
  styleUrls: ['./main-auth.component.css'],
})
export class MainAuthComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'bg-gradient-primary');
  }
}
