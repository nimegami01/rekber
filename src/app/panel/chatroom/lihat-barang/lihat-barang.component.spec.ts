import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LihatBarangComponent } from './lihat-barang.component';

describe('LihatBarangComponent', () => {
  let component: LihatBarangComponent;
  let fixture: ComponentFixture<LihatBarangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LihatBarangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LihatBarangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
