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

  // Salvar livros no localStorage
  saveToLocalStorage(livros: Livro[]): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(livros));
      console.log('Livros salvos no localStorage:', livros);
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  // Obter livros do localStorage
  getFromLocalStorage(): Livro[] {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      const livros = data ? JSON.parse(data) : [];
      console.log('Livros carregados do localStorage:', livros);
      return livros;
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

  // Listar livros: Primeiro tenta carregar do localStorage, depois sincroniza com a API
  getLivros(): Observable<Livro[]> {
    const livrosLocais = this.getFromLocalStorage();

    if (livrosLocais.length > 0) {
      console.log('Livros encontrados no localStorage.');
      return new Observable((observer) => {
        observer.next(livrosLocais);
        observer.complete();
      });
    } else {
      console.log('Buscando livros da API...');
      return new Observable((observer) => {
        this.http.get<Livro[]>(`${this.apiUrl}/list`).subscribe({
          next: (livros) => {
            this.saveToLocalStorage(livros); // Salvar no localStorage
            observer.next(livros);
            observer.complete();
          },
          error: (err) => {
            console.error('Erro ao buscar livros da API:', err);
            observer.error(err);
          },
        });
      });
    }
  }

  // Adicionar livro com atualização do localStorage
  addLivro(formData: FormData): Observable<any> {
    return new Observable((observer) => {
      this.http.post(`${this.apiUrl}/add`, formData).subscribe({
        next: (response) => {
          console.log('Livro adicionado:', response);
          this.http.get<Livro[]>(`${this.apiUrl}/list`).subscribe((livros) => {
            this.saveToLocalStorage(livros); // Atualiza o localStorage
          });
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          console.error('Erro ao adicionar livro:', err);
          observer.error(err);
        },
      });
    });
  }

  // Sincronizar dados do localStorage com a API
  syncWithApi(): void {
    const localData = this.getFromLocalStorage();
    if (localData.length > 0) {
      localData.forEach((livro) => {
        this.addLivro(new FormData()).subscribe({
          next: () => console.log(`Livro ${livro.name} sincronizado com a API`),
          error: (err) =>
            console.error(`Erro ao sincronizar livro ${livro.name}:`, err),
        });
      });
      this.removeFromLocalStorage();
    }
  }
}
