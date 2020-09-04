import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendChartComponent } from './dividend-chart.component';

describe('DividendChartComponent', () => {
  let component: DividendChartComponent;
  let fixture: ComponentFixture<DividendChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DividendChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DividendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
