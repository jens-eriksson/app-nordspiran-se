import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicCompanyComponent } from './public-company.component';

describe('StockComponent', () => {
  let component: PublicCompanyComponent;
  let fixture: ComponentFixture<PublicCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
