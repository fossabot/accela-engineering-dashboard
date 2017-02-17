import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MainMenuComponent } from './components/main-menu/main-menu';
import { ProjectsPage } from './pages/projects/projects';
import { HomePage } from './pages/home/home';
import { ProjectsProvider } from './providers/projects';

const appRoutes: Routes = [
  { path: '', component: HomePage },
  { path: 'projects', component: ProjectsPage }
];

@NgModule({
  imports: [ 
    BrowserModule, 
    RouterModule.forRoot(appRoutes),
    HttpModule
  ],
  declarations: [ 
    AppComponent, 
    MainMenuComponent, 
    ProjectsPage, 
    HomePage
  ],
  providers: [
    ProjectsProvider
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}