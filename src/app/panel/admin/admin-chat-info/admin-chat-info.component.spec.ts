import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChatInfoComponent } from './admin-chat-info.component';

describe('AdminChatInfoComponent', () => {
  let component: AdminChatInfoComponent;
  let fixture: ComponentFixture<AdminChatInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminChatInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminChatInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
