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
  providedIn: 'root',
})
export class LivroService {
  private apiUrl = 'https://sorobooks-backend-1.onrender.com/api/books';
  private cacheExpirationTime = 60 * 60 * 1000; // 1 hora (em milissegundos)

  constructor(private http: HttpClient) {}

  // Listar livros com cache seguro
  getLivros(): Observable<Livro[]> {
    const cachedLivros = localStorage.getItem('livros');
    const cacheTimestamp = localStorage.getItem('livrosTimestamp');

    // Verificar se os dados estão no cache e se o cache não expirou
    if (cachedLivros && cacheTimestamp) {
      const cacheAge = Date.now() - parseInt(cacheTimestamp, 10);
      if (cacheAge < this.cacheExpirationTime) {
        console.log('Usando livros do cache');
        return new Observable((observer) => {
          observer.next(JSON.parse(cachedLivros));
          observer.complete();
        });
      }
    }

    // Se não houver cache ou o cache expirou, buscar os dados da API
    console.log('Buscando livros da API');
    return this.http.get<Livro[]>(`${this.apiUrl}/list`).pipe(
      tap((livros) => {
        try {
          localStorage.setItem('livros', JSON.stringify(livros));
          localStorage.setItem('livrosTimestamp', Date.now().toString());
        } catch (e) {
          console.warn('Erro ao salvar no localStorage. Limpando cache.');
          localStorage.removeItem('livros');
          localStorage.removeItem('livrosTimestamp');
        }
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
