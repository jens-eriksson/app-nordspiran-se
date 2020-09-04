import { RealEstateListComponent } from './real-estate-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealEstateComponent } from './real-estate/real-estate.component';

@NgModule({
  declarations: [RealEstateListComponent, RealEstateComponent],
  imports: [
    CommonModule
  ]
})
export class RealEstateModule { }
