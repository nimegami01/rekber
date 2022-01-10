import { Component, Input, OnInit } from '@angular/core';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  constructor(public global: GlobalVariableService) {}

  @Input('loading') loading: boolean;

  @Input('error') error: boolean;

  ngOnInit(): void {}
}
