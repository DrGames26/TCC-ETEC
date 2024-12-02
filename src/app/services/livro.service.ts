import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livro } from './livro.service';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private apiUrl = 'http://localhost:8080/api'; // Defina a URL base da sua API

  constructor(private http: HttpClient) {}

  // Método para pegar os livros do usuário autenticado
  getBooksByUsuarioPublicador(usuarioPublicador: string): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}/books?usuarioPublicador=${usuarioPublicador}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar livros pelo usuarioPublicador:', error);
        return throwError(error);
      })
    );
  }

  // Método para pegar um livro por ID
  getLivroPorId(id: number): Observable<Livro> {
    return this.http.get<Livro>(`${this.apiUrl}/books/${id}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar livro por ID:', error);
        return throwError(error);
      })
    );
  }
}
