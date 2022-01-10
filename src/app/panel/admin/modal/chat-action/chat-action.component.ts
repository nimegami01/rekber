import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-chat-action',
  templateUrl: './chat-action.component.html',
  styleUrls: ['./chat-action.component.css'],
})
export class ChatActionComponent implements OnInit {
  constructor(private api: ApiService, public bsModalRef: BsModalRef) {}

  chatid: any;
  notif = new FormControl('');
  info = { id: 'loading..', data: { pesan: '', status: '', notif: '' } };

  ngOnInit(): void {
    setTimeout(() => {
      this.api.getCurrentChat(this.chatid).onSnapshot((res) => {
        this.notif.setValue(res.data().notif);
        this.info = {
          id: res.id,
          data: {
            pesan: res.data().pesan,
            status: res.data().status,
            notif: res.data().notif,
          },
        };
        console.log(this.info);
      });
    }, 500);
  }

  updateNotif() {
    this.api.sendChatNotif(this.chatid, this.notif.value).catch((err) => {
      alert('Error');
    });
  }

  updateStatus() {
    let status = 'hide';
    if (this.info.data.status == 'hide') {
      status = 'show';
    }
    this.api.statusChat(this.chatid, status).catch((err) => {
      alert('Error');
    });
  }
}
