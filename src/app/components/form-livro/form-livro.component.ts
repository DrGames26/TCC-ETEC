import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LivroService } from 'src/app/services/livro.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-form-livro',
  templateUrl: './form-livro.component.html',
  styleUrls: ['./form-livro.component.css']
})
export class FormLivroComponent {
  novoLivro = {
    id: 0,
    name: '',
    author: '',
    genre: '',
    description: '',
    picture: '',
    usuarioPublicador: '',
    phoneNumber: ''
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  errorMessage: string = '';

  constructor(
    private livroService: LivroService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Função para comprimir a imagem
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

          // Define dimensões máximas para garantir a redução
          const maxWidth = 800; // Reduzido para controle rigoroso
          const maxHeight = 800;

          let width = img.width;
          let height = img.height;

          // Ajuste proporcional das dimensões
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

          // Converte para Blob com qualidade ajustada
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
                      `Imagem comprimida ainda excede ${maxSizeKB}KB. Tamanho atual: ${(compressedFile.size / 1024).toFixed(2)} KB`
                    )
                  );
                }
              } else {
                reject(new Error('Falha ao gerar o blob da imagem.'));
              }
            },
            file.type,
            0.5 // Redução máxima da qualidade para garantir compressão
          );
        };

        img.onerror = () => reject(new Error('Erro ao carregar a imagem.'));
      };

      reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Gera o preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  adicionarLivro(): void {
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Você precisa estar logado para adicionar um livro.';
      return;
    }

    const usuarioLogado = this.authService.getUser();
    if (!usuarioLogado || !usuarioLogado.name) {
      this.errorMessage = 'Erro ao identificar o usuário logado. Tente novamente.';
      return;
    }

    // Validações de campos
    if (!this.novoLivro.name || !this.novoLivro.author || !this.novoLivro.genre || !this.novoLivro.description) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Por favor, selecione uma imagem.';
      return;
    }

    // Comprime a imagem antes de enviar
    this.compressImage(this.selectedFile, 500) // Limite de 500KB
      .then((compressedFile) => {
        const formData = new FormData();
        formData.append('name', this.novoLivro.name);
        formData.append('author', this.novoLivro.author);
        formData.append('genre', this.novoLivro.genre);
        formData.append('description', this.novoLivro.description);
        formData.append('usuarioPublicador', usuarioLogado.name);
        formData.append('phoneNumber', usuarioLogado.phoneNumber || ''); // Usa o telefone do usuário logado
        formData.append('picture', compressedFile); // Envia o arquivo comprimido

        // Envia o FormData para o serviço
        this.livroService.addLivro(formData).subscribe(
          () => {
            console.log('Livro adicionado com sucesso');
            this.router.navigate(['/livros']);
          },
          (error) => {
            console.error('Erro ao adicionar livro:', error);
            this.errorMessage = 'Erro ao adicionar livro. Tente novamente mais tarde.';
          }
        );
      })
      .catch((error) => {
        console.error('Erro ao comprimir imagem:', error);
        this.errorMessage = 'Erro ao comprimir a imagem. Tente novamente.';
      });
  }
}
