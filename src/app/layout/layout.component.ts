import { ModalProvider } from './modal.provider';
import { Router } from '@angular/router';
import { AuthProvider } from './../auth/auth.provider';
import { LayoutState, SectionState, SectionGroupState } from './layout';
import { LayoutProvider } from './layout.provider';
import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  layoutState: LayoutState;
  activeSection: SectionState;
  userDisplayName = 'Profile';
  showBackdrop: boolean;
  @ViewChild('modalPlaceholder', { read: ViewContainerRef }) modalPlaceholder: ViewContainerRef;

  constructor(
    private layout: LayoutProvider,
    private modal: ModalProvider,
    private auth: AuthProvider,
    private router: Router
  ) {
    this.layout.layoutState.subscribe(layoutState => {
      this.layoutState = layoutState;
      this.activeSection = this.layout.getActiveSection();
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
    this.layout.toggleSidebar();
  }

  toggleSectionGroup(group: SectionGroupState) {
    this.layout.toggleSectionGroup(group);
  }

  activateSection(section: SectionState) {
    if (this.layoutState.mobileView) {
      this.layout.hideSidebar();
    }

    this.router.navigate([section.activePath]);
  }

  appFocus() {
    if (this.layoutState.mobileView) {
      this.layout.hideSidebar();
    }
  }

}
