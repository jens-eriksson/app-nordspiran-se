import { Router } from '@angular/router';
import { LayoutState, Page } from './../layout';
import { LayoutProvider } from './../layout.provider';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  private readonly TAB_WIDTH = 200;
  private tabsComponent: HTMLElement;
  layoutState: LayoutState;
  activePath: string;
  tabs: Page[];
  visableTabs: Page[] = [];
  tabsDropdown: Page[] = [];
  showTabsDropdown = false;

  constructor(
    private layout: LayoutProvider,
    private router: Router
    ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.arrangeTabs();
  }

  ngOnInit() {
    this.tabsComponent = document.getElementById('tabs');
    this.layout.layoutState.subscribe(layoutState => {
      this.layoutState = layoutState;
      this.activePath = layoutState.activePath;
      this.tabs = this.layout.getActiveSection().pages;
      this.arrangeTabs();
    });
  }

  open(page: Page) {
    this.router.navigate([page.paths[0]]);
  }

  close(page: Page) {
    const path = this.layout.unregisterPage(page);
    this.router.navigate([path]);
  }

  togglePageMenu() {
    this.showTabsDropdown = !this.showTabsDropdown;
  }

  toggleSidebar() {
    this.layout.toggleSidebar();
  }

  arrangeTabs() {
    const width = this.tabsComponent.clientWidth;
    const visbaleCount = Math.floor(width / (this.TAB_WIDTH));
    if (visbaleCount < this.tabs.length) {
      this.visableTabs = this.tabs.slice(0, visbaleCount);
      this.tabsDropdown = this.tabs.slice(visbaleCount, this.tabs.length);
    } else {
      this.visableTabs = this.tabs.slice(0, this.tabs.length);
      this.tabsDropdown = [];
    }
    this.showTabsDropdown = false;
  }

  isActive(tab: Page) {
    const path = tab.paths.find(p => p === this.activePath);
    if (path) {
      return true;
    }
    return false;
  }
}
