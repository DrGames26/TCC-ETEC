import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model'; // Verifique se o caminho está correto

@Injectable({
  providedIn: 'root'
})
export class CadastroUsuarioService {
  private apiUrl = 'https://sorobooks-backend-1.onrender.com/api'; // URL da sua API

  constructor(private http: HttpClient) {}

  // Método para cadastrar um novo usuário
  cadastrarUsuario(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(`${this.apiUrl}/register`, user, { headers });
  }

  // Método para obter a lista de usuários
  listarUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Método para excluir um usuário por e-mail
  deleteUserByEmail(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${email}`);
  }

  // Novo método para atualizar um usuário
  updateUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<User>(`${this.apiUrl}/users/${user.email}`, user, { headers });
  }
}
