import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueNetIncomeChartComponent } from './revenue-netincome-chart.component';

describe('CashflowChartComponent', () => {
  let component: RevenueNetIncomeChartComponent;
  let fixture: ComponentFixture<RevenueNetIncomeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueNetIncomeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueNetIncomeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
