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
  private cacheExpirationTime = 60 * 60 * 1000; // 1 hora

  constructor(private http: HttpClient) {}

  // Listar livros com cache e expiração
  getLivros(): Observable<Livro[]> {
    // Verificar se os livros estão armazenados no localStorage e se o cache não expirou
    const cachedLivros = localStorage.getItem('livros');
    const cacheTimestamp = localStorage.getItem('livrosTimestamp');
    
    if (cachedLivros && cacheTimestamp) {
      const cacheAge = Date.now() - parseInt(cacheTimestamp, 10);
      
      // Verificar se o cache ainda está válido (1 hora)
      if (cacheAge < this.cacheExpirationTime) {
        return new Observable(observer => {
          observer.next(JSON.parse(cachedLivros));
          observer.complete();
        });
      }
    }

    // Se o cache expirou ou não existe, fazer a requisição para a API
    return this.http.get<Livro[]>(`${this.apiUrl}/list`).pipe(
      tap(livros => {
        // Armazenar os livros no cache e salvar o timestamp
        localStorage.setItem('livros', JSON.stringify(livros));
        localStorage.setItem('livrosTimestamp', Date.now().toString());
      })
    );
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
