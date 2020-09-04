import { LayoutState } from './../layout';
import { LayoutProvider } from './../layout.provider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  layoutState: LayoutState;
  message: string;
  confirm;
  cancel;

  constructor(private layout: LayoutProvider) { }

  ngOnInit(): void {
    this.layout.layoutState.subscribe(layoutState => {
      this.layoutState = layoutState;
    });
  }
}
