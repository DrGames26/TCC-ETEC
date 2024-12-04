import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private localStorageKey = 'livros';

  constructor(private http: HttpClient) {}

  // Método para pesquisar livros
  searchLivros(query: string): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}/list?search=${query}`);
  }

  // Listar livros (sem cache)
  getLivros(): Observable<Livro[]> {
    console.log('Buscando livros da API');
    return this.http.get<Livro[]>(`${this.apiUrl}/list`);
  }

  // Adicionar livro com compressão de imagem
  addLivro(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, formData);
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

  // Salvar livros no localStorage
  saveToLocalStorage(livros: Livro[]): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(livros));
      console.log('Livros salvos no localStorage');
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  // Obter livros do localStorage
  getFromLocalStorage(): Livro[] {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao obter do localStorage:', error);
      return [];
    }
  }

  // Remover livros do localStorage
  removeFromLocalStorage(): void {
    try {
      localStorage.removeItem(this.localStorageKey);
      console.log('Livros removidos do localStorage');
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  }

  // Sincronizar dados do localStorage com a API
  syncWithApi(): void {
    const localData = this.getFromLocalStorage();
    if (localData.length) {
      localData.forEach((livro) => {
        this.addLivro(new FormData()).subscribe({
          next: () => console.log(`Livro ${livro.name} sincronizado com a API`),
          error: (err) => console.error(`Erro ao sincronizar livro ${livro.name}:`, err),
        });
      });
      this.removeFromLocalStorage();
    }
  }
}
