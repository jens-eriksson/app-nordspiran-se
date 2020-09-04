import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LynchChartComponent } from './lynch-chart.component';

describe('LynchChartComponent', () => {
  let component: LynchChartComponent;
  let fixture: ComponentFixture<LynchChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LynchChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LynchChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
