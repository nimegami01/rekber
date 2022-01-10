import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KirimBarangModalComponent } from './kirim-barang-modal.component';

describe('KirimBarangModalComponent', () => {
  let component: KirimBarangModalComponent;
  let fixture: ComponentFixture<KirimBarangModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KirimBarangModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KirimBarangModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
