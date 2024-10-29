import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model'; // Verifique se o caminho está correto

@Injectable({
  providedIn: 'root'
})
export class CadastroUsuarioService {
  private apiUrl = 'http://localhost:8080/api'; // URL da sua API

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
}
