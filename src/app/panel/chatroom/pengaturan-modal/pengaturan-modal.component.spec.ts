import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengaturanModalComponent } from './pengaturan-modal.component';

describe('PengaturanModalComponent', () => {
  let component: PengaturanModalComponent;
  let fixture: ComponentFixture<PengaturanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PengaturanModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PengaturanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
