import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css'],
})
export class MainPanelComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.removeClass(document.body, 'bg-gradient-primary');
    this.renderer.addClass(document.body, 'page-top');
  }
}
