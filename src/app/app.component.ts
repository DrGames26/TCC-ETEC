import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';  // Importa o AuthService
import { LoginComponent } from './login/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sorobooks';

  @ViewChild(LoginComponent) loginComponent!: LoginComponent;

  dropdownOpen = false;

  constructor(public authService: AuthService) {} // Injeta o AuthService

  // Método para alternar o dropdown do perfil
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Método para abrir o popup de login
  openPopup() {
    this.loginComponent.openPopup(); // Chama o método do LoginComponent
  }

  // Método de logout
  logout() {
    this.authService.logout();
  }

  // Verifica se o usuário está autenticado
  get isAuthenticated() {
    return this.authService.isLoggedIn();
  }

  // Verifica se o usuário autenticado possui um e-mail autorizado
  get isAuthorizedUser() {
    return this.authService.isAuthorized();
  }
}
