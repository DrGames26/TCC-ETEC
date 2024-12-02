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

          const scaleFactor = Math.sqrt(maxSizeKB * 1024 / file.size); // Ajusta para o tamanho desejado
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
            0.7 // Qualidade da compressão (ajustável)
          );
        };
        img.onerror = () => reject(new Error('Erro ao carregar a imagem.'));
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    });
  }

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

  // Adicionar livro com compressão de imagem
  addLivro(livro: Livro, imagem?: File): Observable<any> {
    if (imagem) {
      return new Observable((observer) => {
        this.compressImage(imagem, 3) // Compactar para ~3 KB
          .then((compressedImage) => {
            const formData = new FormData();
            formData.append('livro', JSON.stringify(livro));
            formData.append('imagem', compressedImage);

            this.http.post(`${this.apiUrl}/add`, formData).subscribe({
              next: (response) => {
                observer.next(response);
                observer.complete();
              },
              error: (error) => {
                observer.error(error);
              },
            });
          })
          .catch((error) => {
            observer.error(error);
          });
      });
    } else {
      // Caso não haja imagem
      return this.http.post(`${this.apiUrl}/add`, livro);
    }
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
