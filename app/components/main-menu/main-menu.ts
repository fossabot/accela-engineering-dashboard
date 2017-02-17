import { Component } from '@angular/core';

@Component({
  selector: 'main-menu',
  styles: [`
  `],
  templateUrl: '/components/main-menu/main-menu.html'
})
export class MainMenuComponent {
  activeNavItem: string = 'home';

  setActiveNavItem(item) {
    this.activeNavItem = item;
  }

  isActiveNavItem(item) {
    return this.activeNavItem === item;
  }
}