import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotVerifyComponent } from './not-verify.component';

describe('NotVerifyComponent', () => {
  let component: NotVerifyComponent;
  let fixture: ComponentFixture<NotVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
