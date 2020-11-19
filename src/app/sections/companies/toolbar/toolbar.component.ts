import { ListProvider } from './../../../data/list.provider';
import { AuthProvider } from './../../../auth/auth.provider';
import { ListComponent } from './../list/list.component';
import { List } from './../../../../../shared/list';
import { ImportFileComponent } from './../import-file/import-file.component';
import { ModalProvider } from './../../../layout/modal.provider';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input() lists: List[];
  @Input() list: List;
  @Output('listChange') listChange = new EventEmitter<List>();
  showLists = false;
  
  constructor(
    private modal: ModalProvider,
    private auth: AuthProvider,
    private listProvider: ListProvider
  ) { }

  ngOnInit(): void {
  }

  import() {
    this.modal.open(ImportFileComponent, 500, 300);
  }

  toogleLists() {
    this.showLists = !this.showLists;
  }

  selectList(list: List) {
    this.list = list;
    this.showLists = false;
    this.listChange.emit(list);
  }

  editList(list: List) {
    this.modal.open(ListComponent, 600, 540, list, () => {
      this.listChange.emit(list);
    });
    this.showLists = false;
  }

  newList() {
    const list: List = {
      uid: this.auth.uid(),
      name: '',
      companies: []
    }
    this.modal.open(ListComponent, 600, 540, list, () => {
      this.listChange.emit(list);
    });
    this.showLists = false;
  }

  deleteList(list: List) {
    this.listProvider.delete(list.id);
  }
}
