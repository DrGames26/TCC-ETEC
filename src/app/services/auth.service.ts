import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Lista de e-mails autorizados para acessar abas restritas
  authorizedEmails: string[] = [
    'felipechiav@gmail.com',
    'felipechiav2@gmail.com',
    'gabrielacciari7@gmail.com',
    'gacarneirk@gmail.com',
    'hellenmascarettidasilva11@gmail.com',
    'isabella.esteves1610@gmail.com',
  ];

  // URL base do backend hospedado no Render
  private apiUrl = 'https://sorobooks-backend-1.onrender.com/api';

  private userSubject = new BehaviorSubject<any>(null); // Armazena o usuário autenticado
  public user$ = this.userSubject.asObservable(); // Observable para acessar o usuário

  constructor(private http: HttpClient) {
    // Carrega o usuário armazenado localmente (se houver) ao inicializar
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  // Função de registro de novo usuário
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError((error) => {
        if (error.status === 409) {
          alert('Usuário já existe.'); // Alerta de conflito
        } else {
          alert('Erro ao registrar. Tente novamente.');
        }
        return throwError(error);
      })
    );
  }

  // Função de login do usuário
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        const user = {
          name: response.name,
          email: response.email,
          sex: response.sex,
          profilePicture: response.profilePicture,
          phoneNumber: response.phoneNumber,
        };
        this.userSubject.next(user); // Atualiza o BehaviorSubject com o usuário completo
        localStorage.setItem('user', JSON.stringify(user)); // Salva no localStorage
        return user;
      }),
      catchError((error) => {
        alert('Erro ao fazer login. Verifique suas credenciais.');
        return throwError(error);
      })
    );
  }

  // Função para atualizar o usuário
  updateUser(email: string, updatedUser: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${email}`, updatedUser).pipe(
      map((response: any) => {
        // Atualiza o usuário no BehaviorSubject e no localStorage após a atualização
        const updatedUserData = {
          name: response.name,
          email: response.email,
          sex: response.sex,
          profilePicture: response.profilePicture,
          phoneNumber: response.phoneNumber,
        };
        this.userSubject.next(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        return updatedUserData;
      }),
      catchError((error) => {
        alert('Erro ao atualizar as informações. Tente novamente.');
        return throwError(error);
      })
    );
  }

  // Obtém o usuário autenticado atual
  getUser() {
    return this.userSubject.value;
  }

  // Verifica se o usuário está autenticado
  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  // Função de logout para remover dados de autenticação
  logout() {
    this.userSubject.next(null); // Limpa o BehaviorSubject
    localStorage.removeItem('user'); // Remove o usuário do localStorage
  }

  // Verifica se o usuário autenticado está na lista de e-mails autorizados
  isAuthorized(): boolean {
    const user = this.getUser();
    return user ? this.authorizedEmails.includes(user.email) : false;
  }
}
