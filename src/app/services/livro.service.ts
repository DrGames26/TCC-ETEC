import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Livro {
  id?: number;
  name: string;
  author: string;
  description?: string;
  genre: string;
  picture?: string; 
  usuarioPublicador?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  // Obtém a lista de livros
  getLivros(): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}/list`);
  }

  // Adiciona um novo livro
  addLivro(livro: Livro): Observable<Livro> {
    return this.http.post<Livro>(`${this.apiUrl}/add`, livro);
  }

  // Obtém um livro específico pelo ID
  getLivroPorId(id: number): Observable<Livro> {
    return this.http.get<Livro>(`${this.apiUrl}/${id}`);
  }
}
