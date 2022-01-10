import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-expired',
  templateUrl: './modal-expired.component.html',
  styleUrls: ['./modal-expired.component.css'],
})
export class ModalExpiredComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef) {}

  userRole: any;

  ngOnInit(): void {}
}
