import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCompaniesComponent } from './public-companies.component';

describe('StocksComponent', () => {
  let component: PublicCompaniesComponent;
  let fixture: ComponentFixture<PublicCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
