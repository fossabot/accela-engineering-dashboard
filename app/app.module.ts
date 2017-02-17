import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './components/main-menu/main-menu';
import { ProjectsPage } from './pages/projects/projects';
import { HomePage } from './pages/home/home';

const appRoutes: Routes = [
  { path: '', component: HomePage },
  { path: 'projects', component: ProjectsPage },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '',
  //   redirectTo: '/heroes',
  //   pathMatch: 'full'
  // },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ BrowserModule, RouterModule.forRoot(appRoutes) ],
  declarations: [ AppComponent, MainMenuComponent, ProjectsPage, HomePage ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}