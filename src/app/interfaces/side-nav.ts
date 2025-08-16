import { LoginComponent } from "../components/authentication/login/login.component";


export interface AppRoute {
  path: string;
  component?: any;
  data: any;
  children?: AppRoute[];
}

export const childRoutes: AppRoute[] = [
  {
    path: 'dashboard',
    component: LoginComponent,
    data: { icon: 'dashboard', text: 'Dashboard' }
  },
  {
    path: 'table',
    component: LoginComponent,
    data: { icon: 'table', text: 'Table' }
  },
  {
    path: 'menu',
    data: { text: 'Menu' },
    children: [
      {
        path: 'form',
        component: LoginComponent,
        data: { text: 'Menu1' },
        children: [
          {
            path: 'form',
            component: LoginComponent,
            data: { icon: 'insert_chart', text: 'Menu2' }
          },
          {
            path: 'form',
            component: LoginComponent,
            data: { icon: 'format_color_fill', text: 'Menu3' },
            children: [
              {
                path: 'form',
                component: LoginComponent,
                data: { icon: 'library_add', text: 'Menu4' }
              },
              {
                path: 'form',
                component: LoginComponent,
                data: { icon: 'equalizer', text: 'Menu5' },
                children: [
                  {
                    path: 'form',
                    component: LoginComponent,
                    data: { icon: 'import_contacts', text: 'Menu6' }
                  },
                  {
                    path: 'form',
                    component: LoginComponent,
                    data: { icon: 'list_alt', text: 'Menu7' }
                  },
                  {
                    path: 'form',
                    component: LoginComponent,
                    data: { icon: 'business', text: 'Menu8' }
                  },
                  {
                    path: 'form',
                    component: LoginComponent,
                    data: { icon: 'tab', text: 'Menu9' }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'form',
        component: LoginComponent,
        data: { icon: 'wallpaper', text: 'Menu10' }
      }
    ]
  },
  {
    path: 'form',
    component: LoginComponent,
    data: { icon: 'bar_chart', text: 'Form' }
  },
];