import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqTransaksiSelesaiComponent } from './req-transaksi-selesai.component';

describe('ReqTransaksiSelesaiComponent', () => {
  let component: ReqTransaksiSelesaiComponent;
  let fixture: ComponentFixture<ReqTransaksiSelesaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqTransaksiSelesaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqTransaksiSelesaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
