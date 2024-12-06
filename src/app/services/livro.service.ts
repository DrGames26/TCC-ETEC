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
  private apiUrl = 'https://sorobooks-backend-2.onrender.com/api/books';
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
  
          // Define o tamanho máximo permitido (por exemplo, 1024px de largura ou altura)
          const maxWidth = 1024;
          const maxHeight = 1024;
  
          let width = img.width;
          let height = img.height;
  
          // Ajusta as dimensões proporcionalmente
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                });
  
                // Verifica se o tamanho está dentro do limite
                if (compressedFile.size / 1024 <= maxSizeKB) {
                  resolve(compressedFile);
                } else {
                  reject(
                    new Error(
                      `Não foi possível reduzir a imagem para menos de ${maxSizeKB}KB.`
                    )
                  );
                }
              } else {
                reject(new Error('Falha ao gerar o blob da imagem.'));
              }
            },
            file.type,
            0.7 // Qualidade da compressão (ajustável: de 0.1 a 1.0)
          );
        };
  
        img.onerror = () => reject(new Error('Erro ao carregar a imagem.'));
      };
  
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    });
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
