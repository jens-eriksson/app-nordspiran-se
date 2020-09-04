export interface LayoutState {
    mobileView: boolean;
    showSidebar: boolean;
    activePath: string;
    stocks: SectionState;
    realEstate: SectionState;
    profile: SectionState;
}

export interface SectionState {
    id: string;
    activePath: string;
    pages: Page[];
}

export interface SectionGroupState {
    id: string;
    hidden: boolean;
}

export interface Page {
    id: string;
    paths: string[];
    name: string;
    closeable: boolean;
}

export const DEFAULT_LAYOUT_STATE: LayoutState = {
    mobileView: false,
    showSidebar: true,
    activePath: '/companies',
    stocks: {
        id: '/companies',
        activePath: '/companies',
        pages: [
            {
                id: '/companies',
                name: 'Company list',
                paths: ['/companies'],
                closeable: false
            }
        ]
    },
    realEstate: {
        id: '/real-estate',
        activePath: '/real-estate',
        pages: [
            {
                id: '/real-estate',
                name: 'Real Estate',
                paths: ['/real-estate'],
                closeable: false
            }
        ]
    },
    profile: {
        id: '/profile',
        activePath: '/profile',
        pages: [
            {
                id: '/profile',
                name: 'My Profile',
                paths: [
                    '/profile',
                    '/profile/edit-profile',
                    '/profile/change-password'
                ],
                closeable: false
            }
        ]
    }
};


