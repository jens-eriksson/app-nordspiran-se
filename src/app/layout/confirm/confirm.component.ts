import { Layout } from './../../../../shared/layout';
import { LayoutProvider } from './../layout.provider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  layout: Layout;
  message: string;
  confirm;
  cancel;

  constructor(private layoutProvider: LayoutProvider) { }

  ngOnInit(): void {
    this.layoutProvider.layout.subscribe(layout => {
      this.layout = layout;
    });
  }
}
