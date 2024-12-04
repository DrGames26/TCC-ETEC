import { Component, ViewChild } from '@angular/core';
import { LivroService, Livro } from './services/livro.service';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sorobooks';
  livros: Livro[] = [];
  searchTerm: string = '';

  @ViewChild(LoginComponent) loginComponent!: LoginComponent;

  dropdownOpen = false;

  constructor(
    public authService: AuthService, 
    private livroService: LivroService
  ) {}

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

  // Buscar livros pelo termo de pesquisa
  onSearch() {
    if (this.searchTerm.trim()) {
      this.livroService.searchLivros(this.searchTerm).subscribe((result) => {
        this.livros = result;
      });
    } else {
      this.livroService.getLivros().subscribe((result) => {
        this.livros = result;
      });
    }
  }
}
