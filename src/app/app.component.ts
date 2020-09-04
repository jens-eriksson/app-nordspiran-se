import { Component, OnInit } from '@angular/core';
import { LayoutProvider } from './layout/layout.provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loaderVisibale: boolean;

  constructor(private layout: LayoutProvider) {
  }

  ngOnInit() {
    this.layout.loaderVisibale.subscribe(loaderVisibale => {
      this.loaderVisibale = loaderVisibale;
    });
  }
}
