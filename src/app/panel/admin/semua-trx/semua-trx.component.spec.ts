import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemuaTrxComponent } from './semua-trx.component';

describe('SemuaTrxComponent', () => {
  let component: SemuaTrxComponent;
  let fixture: ComponentFixture<SemuaTrxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemuaTrxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemuaTrxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
