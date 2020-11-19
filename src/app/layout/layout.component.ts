import { ModalProvider } from './modal.provider';
import { Router } from '@angular/router';
import { AuthProvider } from './../auth/auth.provider';
import { Layout , Section, SectionGroup } from './../../../shared/layout';
import { LayoutProvider } from './layout.provider';
import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  layout: Layout;
  topSections: Section[];
  bottomSections: Section[];
  userDisplayName = 'Profile';
  showBackdrop: boolean;
  @ViewChild('modalPlaceholder', { read: ViewContainerRef }) modalPlaceholder: ViewContainerRef;

  constructor(
    private layoutProvider: LayoutProvider,
    private modal: ModalProvider,
    private auth: AuthProvider,
    private router: Router
  ) {
    this.layoutProvider.layout.subscribe(layout => {
      this.layout = layout;
      this.topSections = layout.sections.filter(s => s.position === 'top');
      this.bottomSections = layout.sections.filter(s => s.position === 'bottom');
    });
    this.modal.isOpen.subscribe(isOpen => {
      this.showBackdrop = isOpen;
    });
    this.auth.user.subscribe(user => {
      if (user && user.displayName) {
        this.userDisplayName = user.displayName;
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.modal.setPlaceholder(this.modalPlaceholder);
  }

  toggleSidebar() {
    this.layoutProvider.toggleSidebar();
  }

  toggleSectionGroup(group: SectionGroup) {
    this.layoutProvider.toggleSectionGroup(group);
  }

  activateSection(section: Section) {
    if (this.layout.state.mobileView) {
      this.layoutProvider.hideSidebar();
    }

    this.router.navigate([this.layoutProvider.getActivePath(section)]);
  }

  appFocus() {
    if (this.layout.state.mobileView) {
      this.layoutProvider.hideSidebar();
    }
  }

}
