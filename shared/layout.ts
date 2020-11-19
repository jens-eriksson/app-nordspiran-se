export interface Layout {
    id?: string;
    appName: string;
    version: number;
    sections: Section[];
    state: {
        mobileView: boolean;
        showSidebar: boolean;
        activeSection: string;
    };
}

export interface SectionGroup {
    id: string;
    name: string;
    state: {
        hidden: boolean;
    };
}

export interface Section {
    id: string;
    name: string;
    position: string;
    state: {
        activeTab: string;
        tabs: Tab[];
    };
}

export interface Tab {
    id: string;
    name: string;
    closeable: boolean;
    icon?: string;
    pages: Page[];
    state: {
        activePage: string;
    };
}

export interface Page {
    path: string;
    state?: any;
}
