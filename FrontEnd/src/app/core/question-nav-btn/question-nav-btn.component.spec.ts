import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionNavBtnComponent } from './question-nav-btn.component';

describe('QuestionNavBtnComponent', () => {
  let component: QuestionNavBtnComponent;
  let fixture: ComponentFixture<QuestionNavBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionNavBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionNavBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
