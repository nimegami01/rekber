import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndanganListComponent } from './undangan-list.component';

describe('UndanganListComponent', () => {
  let component: UndanganListComponent;
  let fixture: ComponentFixture<UndanganListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndanganListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UndanganListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
