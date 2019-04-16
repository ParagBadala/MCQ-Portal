import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPortalComponent } from './test-portal.component';

describe('TestPortalComponent', () => {
  let component: TestPortalComponent;
  let fixture: ComponentFixture<TestPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
