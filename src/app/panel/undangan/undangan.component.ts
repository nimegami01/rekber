import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-undangan',
  templateUrl: './undangan.component.html',
  styleUrls: ['./undangan.component.css'],
})
export class UndanganComponent implements OnInit {
  constructor(private route: ActivatedRoute, private api: ApiService) {}

  current_id: any;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.current_id = params['id'];
      this.getUndanganInfo(params['id']);
    });
  }

  undanganInfo: any;
  loading = true;
  async getUndanganInfo(id) {
    this.loading = true;
    this.undanganInfo = '';
    this.api.ambilUndanganWithId(id).onSnapshot(async (res) => {
      if (res.exists) {
        let penjual: any;
        let transaksi: any;
        try {
          let penjual_ = await this.api.getCurrentUserWithId(
            res.data().uid_penjual
          );
          penjual_.forEach((doc) => {
            penjual = doc.data();
          });

          try {
            let transaksi_ = await this.api
              .getTransactionWithID(res.data().id_transaksi)
              .get();

            transaksi_.forEach((doc) => {
              transaksi = doc.data();
            });
          } catch {}
        } catch {}

        this.undanganInfo = {
          data: res.data(),
          penjual: penjual,
          transaksi: transaksi,
        };
        this.loading = false;
        console.log(this.undanganInfo);
      }
    });
  }

  aksiUndangan(action: number) {
    this.api.aksiUndangan(
      action,
      this.current_id,
      this.undanganInfo.transaksi.id,
      this.undanganInfo.transaksi.durasi
    );
  }
}
