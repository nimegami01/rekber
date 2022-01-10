import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndanganComponent } from './undangan.component';

describe('UndanganComponent', () => {
  let component: UndanganComponent;
  let fixture: ComponentFixture<UndanganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndanganComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UndanganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
