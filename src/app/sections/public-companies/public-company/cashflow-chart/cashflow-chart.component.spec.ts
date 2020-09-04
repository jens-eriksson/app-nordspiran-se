import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowChartComponent } from './cashflow-chart.component';

describe('CashflowChartComponent', () => {
  let component: CashflowChartComponent;
  let fixture: ComponentFixture<CashflowChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
