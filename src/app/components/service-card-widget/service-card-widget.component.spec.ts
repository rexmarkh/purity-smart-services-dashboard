import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCardWidgetComponent } from './service-card-widget.component';

describe('ServiceCardWidgetComponent', () => {
  let component: ServiceCardWidgetComponent;
  let fixture: ComponentFixture<ServiceCardWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCardWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCardWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
