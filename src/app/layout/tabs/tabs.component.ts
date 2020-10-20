import { Router } from '@angular/router';
import { Layout, Tab } from './../../../../shared/layout';
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
  layout: Layout;
  activePath: string;
  tabs: Tab[];
  visableTabs: Tab[] = [];
  tabsDropdown: Tab[] = [];
  showTabsDropdown = false;

  constructor(
    private layoutProvider: LayoutProvider,
    private router: Router
    ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.arrangeTabs();
  }

  ngOnInit() {
    this.tabsComponent = document.getElementById('tabs');
    this.layoutProvider.layout.subscribe(layout => {
      this.layout = layout;
      this.activePath = this.layoutProvider.getActivePath();
      this.tabs = this.layoutProvider.getActiveSection().state.tabs;
      this.arrangeTabs();
    });
  }

  open(tab: Tab) {
    this.router.navigate([tab.state.activePage]);
  }

  close(tab: Tab) {
    const path = this.layoutProvider.closeTab(tab);
    this.router.navigate([path]);
  }

  togglePageMenu() {
    this.showTabsDropdown = !this.showTabsDropdown;
  }

  toggleSidebar() {
    this.layoutProvider.toggleSidebar();
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

  isActive(tab: Tab) {
    const path = tab.pages.find(p => p.path === this.activePath);
    if (path) {
      return true;
    }
    return false;
  }
}
