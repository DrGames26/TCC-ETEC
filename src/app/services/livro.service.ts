import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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

  // Método para compactar imagens
  compressImage(file: File, maxSizeKB: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          const scaleFactor = Math.sqrt((maxSizeKB * 1024) / file.size);
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Falha ao comprimir a imagem.'));
              }
            },
            file.type,
            0.7
          );
        };
        img.onerror = () => reject(new Error('Erro ao carregar a imagem.'));
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    });
  }

  // Listar livros da API
  getLivros(): Observable<Livro[]> {
    console.log('Carregando livros da API...');
    return this.http.get<Livro[]>(`${this.apiUrl}/list`).pipe(
      tap((data) => console.log(`Livros retornados (${data.length}):`, data)),
      catchError((error) => {
        console.error('Erro ao buscar livros da API:', error);
        return throwError(() => new Error('Erro ao carregar livros da API.'));
      })
    );
  }

  // Adicionar livro
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
      console.log('Livros salvos no localStorage.');
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  // Obter livros do localStorage
  getFromLocalStorage(): Livro[] {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      const livros = data ? JSON.parse(data) : [];
      console.log(`Livros recuperados do localStorage (${livros.length}):`, livros);
      return livros;
    } catch (error) {
      console.error('Erro ao recuperar livros do localStorage:', error);
      return [];
    }
  }

  // Remover livros do localStorage
  removeFromLocalStorage(): void {
    try {
      localStorage.removeItem(this.localStorageKey);
      console.log('Livros removidos do localStorage.');
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  }

  // Sincronizar localStorage com a API
  syncWithApi(): void {
    const localData = this.getFromLocalStorage();
    if (localData.length) {
      localData.forEach((livro) => {
        const formData = new FormData();
        formData.append('name', livro.name);
        formData.append('author', livro.author);
        formData.append('description', livro.description || '');
        formData.append('genre', livro.genre);
        if (livro.picture) {
          formData.append('picture', livro.picture);
        }
        formData.append('usuarioPublicador', livro.usuarioPublicador || '');

        this.addLivro(formData).subscribe({
          next: () => console.log(`Livro ${livro.name} sincronizado com a API.`),
          error: (err) => console.error(`Erro ao sincronizar livro ${livro.name}:`, err),
        });
      });
      this.removeFromLocalStorage();
    }
  }
}
