import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface Livro {
  id: number;
  name: string;
  author: string;
  description?: string;
  genre: string;
  picture?: string;
  usuarioPublicador?: string;
  phoneNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private apiUrl = 'https://sorobooks-backend-1.onrender.com/api/books';

  constructor(private http: HttpClient) {}

  // Listar livros
  getLivros(): Observable<Livro[]> {
    // Verificar se os livros estão armazenados no localStorage
    const cachedLivros = localStorage.getItem('livros');
    if (cachedLivros) {
      // Se estiverem no cache, retornar os dados diretamente
      return new Observable(observer => {
        observer.next(JSON.parse(cachedLivros));
        observer.complete();
      });
    } else {
      // Se não estiverem no cache, fazer a requisição para a API
      return this.http.get<Livro[]>(`${this.apiUrl}/list`).pipe(
        tap(livros => {
          // Armazenar os livros no cache para a próxima vez
          localStorage.setItem('livros', JSON.stringify(livros));
        })
      );
    }
  }

  // Adicionar livro
  addLivro(livro: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, livro);
  }

  // Obter livro pelo ID
  getLivroPorId(id: number): Observable<Livro> {
    return this.http.get<Livro>(`${this.apiUrl}/${id}`);
  }

  // Obter livros pelo nome do usuário publicador
  getBooksByUsuarioPublicador(usuarioPublicador: string): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}/my-books?usuarioPublicador=${usuarioPublicador}`);
  }

  // Excluir livro
  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookId}`);
  }

  // Atualizar livro
  updateBook(livro: Livro): Observable<Livro> {
    return this.http.put<Livro>(`${this.apiUrl}/${livro.id}`, livro);
  }
}
