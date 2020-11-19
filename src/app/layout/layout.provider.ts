import { AuthProvider } from './../auth/auth.provider';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Layout, Section, SectionGroup, Page, Tab } from './../../../shared/layout';
import { DEFAULT_LAYOUT } from './default-layout';
import { Title } from '@angular/platform-browser';
import { DataProvider } from '../data/data.provider';

@Injectable()
export class LayoutProvider extends DataProvider<Layout>{
    private readonly LAYOUT_KEY = 'layout';
    private _layout = DEFAULT_LAYOUT;
    public layout = new BehaviorSubject<Layout>(DEFAULT_LAYOUT);
    public loaderVisibale: BehaviorSubject<boolean>;

    constructor(
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private title: Title,
        private auth: AuthProvider
    ) {
        super('layouts');
        this.load();
        this.loaderVisibale = new BehaviorSubject(false);
        this.breakpointObserver
        .observe(['(max-width: 768px)'])
        .subscribe((state: BreakpointState) => {
            if (state.matches) {
                this._layout.state.mobileView = true;
                this._layout.state.showSidebar = false;
            } else {
                this._layout.state.mobileView = false;
            }
            this.save();
        });

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.hideLoader();
                this.activatePath(event.urlAfterRedirects);
            }
        });
    }

    private load() {
        this._layout = JSON.parse(localStorage.getItem(this.LAYOUT_KEY));
        if (!this._layout) {
            this._layout = DEFAULT_LAYOUT;
        }
        if(this._layout.version !== DEFAULT_LAYOUT.version) {
            this._layout = DEFAULT_LAYOUT;
        }
        const uid = this.auth.uid();
        if (uid) {
            this._layout.id = uid;
        }
        this.layout.next(this._layout);
        
        this.get(uid).then(layout => {
            if (layout && layout.version === DEFAULT_LAYOUT.version) {
                this._layout = layout;
                this.layout.next(layout);
            }
        })
    }
    
    private save() {
        const uid = this.auth.uid();
        if (uid) { 
            this._layout.id = uid;
        }
        localStorage.setItem(this.LAYOUT_KEY, JSON.stringify(this._layout));

        this.layout.next(this._layout);
        this.set(this._layout);
    }

    public openTab(tab: Tab) {
        const section = this.getActiveSection();
        const t = section.state.tabs.find(x => x.id === tab.id);
        if (t) {
            t.name = tab.name;
            t.closeable = tab.closeable;
        } else {
            section.state.tabs.push(tab);
        }
        this.save();
    }

    public closeTab(tab: Tab): string {
        const section = this.getActiveSection();
        if (!section) {
            return;
        }
        const index = section.state.tabs.findIndex(t => t.id === tab.id);

        if (index > -1) {
            let navigateToIndex = index - 1;
            if (navigateToIndex < 0) {
                navigateToIndex = 0;
            }
            section.state.tabs.splice(index, 1);

            if (section.state.activeTab === tab.id) {
                section.state.activeTab = section.state.tabs[navigateToIndex].id;
            }

            this.save();
        }

        return this.getActiveTab(section).state.activePage;
    }

    public toggleSidebar() {
        this._layout.state.showSidebar = !this._layout.state.showSidebar;
        this.save();
    }

    public showSidebar() {
        this._layout.state.showSidebar = true;
        this.save();
    }

    public hideSidebar() {
        this._layout.state.showSidebar = false;
        this.save();
    }

    public toggleSectionGroup(group: SectionGroup) {
        group.state.hidden = !group.state.hidden;
        this.save();
    }

    public showLoader() {
        this.loaderVisibale.next(true);
    }

    public hideLoader() {
        this.loaderVisibale.next(false);
    }

    private activatePath(path: string) {
        const section = this.getSection(path);
        if (section) {
            let tab = this.getTab(path);
            if (!tab) {
                tab = this.newTab([path]);
                this.openTab(tab);
            }
            this._layout.state.activeSection = section.id;
            section.state.activeTab = tab.id;
            tab.state.activePage = path;
            this.title.setTitle(tab.name);
        }
        this.save();
    }

    public getSection(path: string): Section {
        let section = null;
        let sectionPath = null;
        const segments = path.split('/');
        if (segments.length > 1) {
            sectionPath = '/' + segments[1];
        }
        if (sectionPath) {
            for (const s of this._layout.sections) {
                if (s.id === sectionPath) {
                    section = s;
                    return section;
                }
            }
        }
        return section;
    }

    public getTab(path: string): Tab {
        let result = null;
        for (const section of this._layout.sections) {
            if (result) {
                break;
            }
            for (const tab of section.state.tabs) {
                const page = tab.pages.find(p => p.path === path);
                if (page) {
                    result = tab;
                    break;
                }
            }
        }
        return result;
    }

    public getPage(path: string): Page {
        let result = null;
        for (const section of this._layout.sections) {
            if (result) {
                break;
            }
            for (const tab of section.state.tabs) {
                const page = tab.pages.find(p => p.path === path);
                if (page) {
                    result = page;
                    break;
                }
            }
        }
        return result;
    }

    public getActiveSection(): Section {
            return this._layout.sections.find(s => s.id === this._layout.state.activeSection);
        }
    public getActiveTab(section?: Section): Tab {
        if (!section) {
            section = this.getActiveSection();
        }
        return section.state.tabs.find(t => t.id === section.state.activeTab);
    }

    public getActivePage(tab?: Tab): Page {
        if (!tab) {
            tab = this.getActiveTab();
        }
        return tab.pages.find(p => p.path === tab.state.activePage);
    }

    public getActivePath(section?: Section): string {
        if (!section) {
            section = this.getActiveSection();
        }
        return this.getActiveTab(section).state.activePage;
    }

    public savePageState(path: string, state: any) {
        const page = this.getPage(path);
    }

    public newTab(paths: string[], name?: string, closable?: boolean) {
        const pages = [];
        paths.forEach(path => {
            pages.push({ path });
        });
        return {
            id: paths[0],
            name: name ? name : paths[0],
            closeable: closable ? closable : true,
            pages,
            state: {
                activePage: pages[0]
            }
        };
    }
}
