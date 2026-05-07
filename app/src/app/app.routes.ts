import { Route } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'home', loadChildren: () => import('app/home/home.routes') },
            { path: 'preferences', loadChildren: () => import('app/pref/pref.routes') },
            { path: 'certificates', loadChildren: () => import('app/certi/certi.routes') },
        ],
    },

    {
        path: 'not-found',
        loadComponent: () =>
            import('app/error/error.component').then(
                (m) => m.ErrorComponent
            ),
    },
    { path: '**', redirectTo: 'not-found' }
];
