import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetChartComponent } from './balance-sheet-chart.component';

describe('BalanceSheetChartComponent', () => {
  let component: BalanceSheetChartComponent;
  let fixture: ComponentFixture<BalanceSheetChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceSheetChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceSheetChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
