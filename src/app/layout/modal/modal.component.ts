import { Layout } from './../../../../shared/layout';
import { LayoutProvider } from './../layout.provider';
import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modalContent', { read: ViewContainerRef }) private modalContent: ViewContainerRef;
  layout: Layout;
  maxWidth;
  maxHeight;
  content;
  data;
  confirm;
  cancel;

  constructor(private resolver: ComponentFactoryResolver, private layoutProvider: LayoutProvider, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.layoutProvider.layout.subscribe(layout => {
      this.layout = layout;
    });
  }

  ngAfterViewInit() {
    if (this.content) {
      const factory = this.resolver.resolveComponentFactory(this.content);
      const compRef = this.modalContent.createComponent(factory);
      compRef.instance['cancel'] = this.cancel;
      compRef.instance['confirm'] = this.confirm;
      compRef.instance['data'] = this.data;
      this.cd.detectChanges();
    }
  }
}
