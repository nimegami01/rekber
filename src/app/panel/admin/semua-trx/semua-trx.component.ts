import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { GlobalVariableService } from 'src/app/_global/global-variable.service';

@Component({
  selector: 'app-semua-trx',
  templateUrl: './semua-trx.component.html',
  styleUrls: ['./semua-trx.component.css'],
})
export class SemuaTrxComponent implements OnInit {
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private global: GlobalVariableService,
    private router: Router
  ) {}

  searchValue = new FormControl('');

  statusValue = new FormControl('');

  typeValue = new FormControl('');

  roleValue = new FormControl('');

  search_result: any;
  search_count_result: number;

  loading = true;

  baseTitle: string;

  id_param: any;

  ngOnInit(): void {
    this.route.params.subscribe((param_utama) => {
      this.route.queryParams.subscribe((params) => {
        this.search_result = '';
        this.searchValue.setValue(params['search']);
        this.statusValue.setValue(
          this.defaultValue(params['status'], 'status')
        );
        this.typeValue.setValue(this.defaultValue(params['type'], 'type'));
        this.roleValue.setValue(this.defaultValue(params['role'], 'role'));
        this.searchResult({
          search: this.searchValue.value,
          status: this.statusValue.value,
          type: this.typeValue.value,
          role: this.roleValue.value,
        });

        this.id_param = param_utama['id'];

        if (param_utama['id'] == 'search') {
          this.baseTitle = 'Pencarian';
        } else if (param_utama['id'] == 'transaksi') {
          this.baseTitle =
            'Daftar Transaksi - <span class="text-primary">' +
            (this.statusValue.value == 'all'
              ? 'SEMUA'
              : this.statusValue.value.toUpperCase()) +
            '</span>';
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      });
    });
  }

  defaultValue(name: any, type: any) {
    let data = 'all';

    if (type == 'status') {
      if (
        name != 'all' &&
        name != 'pending' &&
        name != 'success' &&
        name != 'open' &&
        name != 'failed' &&
        name != 'cancel'
      ) {
        data = 'all';
      } else {
        data = name;
      }
    } else if (type == 'role') {
      if (name != 'all' && name != 'penjual' && name != 'pembeli') {
        data = 'all';
      } else {
        data = name;
      }
    } else if (type == 'type') {
      if (name != 'all' && name != 'barang_fisik' && name != 'barang_digital') {
        data = 'all';
      } else {
        data = name;
      }
    }

    return data;
  }

  async searchResult(data: any) {
    this.loading = true;
    this.api.getAllTransaksi().onSnapshot(async (res) => {
      let result = [];
      res.forEach((doc) => {
        if (data.status == 'all') {
          result.push(doc.data());
        } else if (data.status == 'open') {
          if (
            doc.data().status == 'active' &&
            doc.data().uid_pembeli &&
            doc.data().uid_penjual
          ) {
            result.push(doc.data());
          }
        } else if (data.status == 'pending') {
          if (
            doc.data().status == 'active' &&
            (!doc.data().uid_pembeli || !doc.data().uid_penjual)
          ) {
            result.push(doc.data());
          }
        } else if (data.status == 'success') {
          if (doc.data().status == 'success') {
            result.push(doc.data());
          }
        } else if (data.status == 'cancel') {
          if (doc.data().status == 'cancel') {
            result.push(doc.data());
          }
        } else if (data.status == 'failed') {
          if (doc.data().status == 'failed') {
            result.push(doc.data());
          }
        }
      });
      let result_2 = [];
      for (let i = 0; i < result.length; i++) {
        if (data.type == 'barang_fisik' && result[i].jenis_barang == 'fisik') {
          result_2.push(result[i]);
        } else if (
          data.type == 'barang_digital' &&
          result[i].jenis_barang == 'digital'
        ) {
          result_2.push(result[i]);
        } else if (data.type == 'all') {
          result_2.push(result[i]);
        }
      }

      let result_3 = [];

      for (let i = 0; i < result_2.length; i++) {
        result_3.push(result_2[i]);
      }

      let result_4 = [];

      for (let i = 0; i < result_3.length; i++) {
        try {
          let temp = await this.api.getCurrentUserWithId(
            result_3[i].uid_pembeli
          );

          let data_pembeli: any;

          temp.forEach((doc_user) => {
            data_pembeli = doc_user.data();
          });

          try {
            let temp_ = await this.api.getCurrentUserWithId(
              result_3[i].uid_penjual
            );

            let data_penjual: any;

            temp_.forEach((doc_user) => {
              data_penjual = doc_user.data();
            });

            result_4.push({
              data: result_3[i],
              pembeli: data_pembeli,
              penjual: data_penjual,
            });
          } catch {}
        } catch {}
      }
      this.search_result = this.global.search(data.search, result_4);
      this.search_count_result = this.search_result.length;
      this.loading = false;
    });
  }

  search() {
    this.router.navigateByUrl(
      '/user/list/' +
        this.id_param +
        '?status=' +
        this.statusValue.value +
        '&type=' +
        this.typeValue.value +
        '&search=' +
        (this.searchValue.value ? this.searchValue.value : '') +
        '&role=' +
        this.roleValue.value
    );
  }
}
