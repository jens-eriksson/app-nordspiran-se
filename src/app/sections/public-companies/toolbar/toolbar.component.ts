import { ImportFileComponent } from './../import-file/import-file.component';
import { ModalProvider } from './../../../layout/modal.provider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(private modal: ModalProvider) { }

  ngOnInit(): void {
  }

  import() {
    this.modal.open(ImportFileComponent, 500, 300);
  }
}
