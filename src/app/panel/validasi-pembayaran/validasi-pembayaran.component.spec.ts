import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidasiPembayaranComponent } from './validasi-pembayaran.component';

describe('ValidasiPembayaranComponent', () => {
  let component: ValidasiPembayaranComponent;
  let fixture: ComponentFixture<ValidasiPembayaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidasiPembayaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidasiPembayaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
