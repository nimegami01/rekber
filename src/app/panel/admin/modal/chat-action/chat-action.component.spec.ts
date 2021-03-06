import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatActionComponent } from './chat-action.component';

describe('ChatActionComponent', () => {
  let component: ChatActionComponent;
  let fixture: ComponentFixture<ChatActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
