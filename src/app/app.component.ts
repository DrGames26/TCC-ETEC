import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from './login/login/login.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sorobooks';

  // Acessa o componente de login para abrir o popup a partir do menu
  @ViewChild(LoginComponent) loginComponent!: LoginComponent;

  dropdownOpen = false; // Controla a exibição do submenu

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
