import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAServiceModalComponent } from './book-a-service-modal.component';

describe('BookAServiceModalComponent', () => {
  let component: BookAServiceModalComponent;
  let fixture: ComponentFixture<BookAServiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookAServiceModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookAServiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
