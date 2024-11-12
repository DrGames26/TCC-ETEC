import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Livro {
  id?: number; // id não é opcional
  name: string;
  author: string;
  description: string; // Corrigido para ser obrigatório
  genre: string;
  picture?: string;
  usuarioPublicador: string; // O campo 'usuarioPublicador' agora é obrigatório
}

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private apiUrl = 'https://sorobooks-backend.onrender.com/api/books'; // URL do backend hospedado

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

  // Atualiza as informações de um livro
  editLivro(livro: Livro): Observable<Livro> {
    return this.http.put<Livro>(`${this.apiUrl}/${livro.id}`, livro); // Faz a requisição PUT para editar
  }

  // Obtém os livros do usuário
  getBooksByUsuarioPublicador(usuarioPublicador: string): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}/my-books?usuarioPublicador=${usuarioPublicador}`);
  }

  // Exclui um livro pelo ID
  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookId}`);
  }
}
