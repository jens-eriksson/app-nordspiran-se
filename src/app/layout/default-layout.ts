import { Layout } from '../../../shared/layout';

export const DEFAULT_LAYOUT: Layout = {
    appName: 'Nordspiran',
    version: 3,
    sections: [{
        id: '/companies',
        name: 'Public Companies',
        position: 'top',
        state: {
            activeTab: '/companies',
            tabs: [{
                id: '/companies',
                name: 'Companies',
                pages: [{
                    path: '/companies'
                }],
                closeable: false,
                icon: 'fas fa-home',
                state: {
                    activePage: '/companies'
                }
            }]
        }
    },
    {
        id: '/profile',
        name: 'Profile',
        position: 'bottom',
        state: {
            activeTab: '/profile',
            tabs: [{
                id: '/profile',
                name: 'Profile',
                pages: [{
                    path: '/profile',
                },
                {
                    path: '/change-password',
                },
                {
                    path: '/edit-profile',
                }],
                closeable: false,
                icon: null,
                state: {
                    activePage: '/profile'
                }
            }]
        }
    }],
    state: {
        mobileView: false,
        showSidebar: true,
        activeSection: '/companies'
    }
};
