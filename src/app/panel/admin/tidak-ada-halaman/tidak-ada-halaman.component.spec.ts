import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TidakAdaHalamanComponent } from './tidak-ada-halaman.component';

describe('TidakAdaHalamanComponent', () => {
  let component: TidakAdaHalamanComponent;
  let fixture: ComponentFixture<TidakAdaHalamanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TidakAdaHalamanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TidakAdaHalamanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
