import { BehaviorSubject, Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { LayoutState, SectionState, DEFAULT_LAYOUT_STATE, SectionGroupState, Page } from './layout';

@Injectable()
export class LayoutProvider {
    private readonly LAYOUT_STATE_STORAGE_KEY = 'layout-state';
    private _layoutState: LayoutState;
    public loaderVisibale: BehaviorSubject<boolean>;
    public layoutState: BehaviorSubject<LayoutState>;
    public windowResize;

    constructor(
        private router: Router,
        private breakpointObserver: BreakpointObserver
    ) {
        this.load();
        this.loaderVisibale = new BehaviorSubject(false);
        this.breakpointObserver
        .observe(['(max-width: 768px)'])
        .subscribe((state: BreakpointState) => {
            if (state.matches) {
                this._layoutState.mobileView = true;
                this._layoutState.showSidebar = false;
            } else {
                this._layoutState.showSidebar = true;
                this._layoutState.mobileView = false;
            }
            this.save();
        });

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.hideLoader();
                this.activatePath(event.urlAfterRedirects);
            }
        });

        this.windowResize = new Subject();
        window.onresize = () => {
            this.windowResize.next();
        };
    }

    public registerPage(page: Page) {
        const section = this.getSection(page.paths[0]);
        const p = section.pages.find(x => x.id === page.id);
        if (p) {
            p.name = page.name;
            p.closeable = page.closeable;
        } else {
            section.pages.push(page);
        }
        this.save();
    }

    public unregisterPage(page: Page): string {
        const section = this.getSection(page.paths[0]);
        if (!section) {
            return;
        }
        const index = section.pages.findIndex(p => p.id === page.id);

        if (index > -1) {
            let navigateToIndex = index - 1;
            if (navigateToIndex < 0) {
                navigateToIndex = 0;
            }
            section.pages.splice(index, 1);

            if (this.hasPath(page, section.activePath)) {
                section.activePath = section.pages[navigateToIndex].paths[0];
            }

            this.save();
        }

        return section.activePath;
    }

    public toggleSidebar() {
        this._layoutState.showSidebar = !this._layoutState.showSidebar;
        this.save();
    }

    public showSidebar() {
        this._layoutState.showSidebar = true;
        this.save();
    }

    public hideSidebar() {
        this._layoutState.showSidebar = false;
        this.save();
    }

    public toggleSectionGroup(group: SectionGroupState) {
        group.hidden = !group.hidden;
        this.save();
    }

    public showLoader() {
        this.loaderVisibale.next(true);
    }

    public hideLoader() {
        this.loaderVisibale.next(false);
    }

    public getActiveSection(): SectionState {
        return this.getSection(this._layoutState.activePath);
    }

    private activatePath(path: string) {
        const section = this.getSection(path);
        if (section) {
            this._layoutState.activePath = path;
            section.activePath = path;
        }

        this.save();
    }

    private load() {
        const layoutState = JSON.parse(localStorage.getItem(this.LAYOUT_STATE_STORAGE_KEY));
        if (layoutState) {
            this._layoutState =  layoutState;
        } else {
            this._layoutState = DEFAULT_LAYOUT_STATE;
        }
        this.layoutState = new BehaviorSubject<LayoutState>(this._layoutState);
    }

    private save() {
        localStorage.setItem(this.LAYOUT_STATE_STORAGE_KEY, JSON.stringify(this._layoutState));
        this.layoutState.next(this._layoutState);
    }

    private getSection(path: string): SectionState {
        let section = null;
        let sectionPath = null;
        const segments = path.split('/');
        if (segments.length > 1) {
            sectionPath = '/' + segments[1];
        }
        if (sectionPath) {
            for (const prop in this._layoutState) {
                if (this._layoutState[prop] && this._layoutState[prop].id === sectionPath) {
                    section = this._layoutState[prop];
                    return section;
                }
            }
        }
        return section;
    }

    private getPage(section: SectionState, path: string): Page {
        let result = null;
        for (const page of section.pages) {
            const p = page.paths.find(x => x === path);
            if (p) {
                result = page;
                break;
            }
        }
        return result;
    }

    private hasPath(page: Page, path: string): boolean {
        const p = page.paths.find(x => x === path);
        if (p) {
            return true;
        }
        return false;
    }
}
