import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReviewWidgetComponent } from './user-review-widget.component';

describe('UserReviewWidgetComponent', () => {
  let component: UserReviewWidgetComponent;
  let fixture: ComponentFixture<UserReviewWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReviewWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReviewWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
