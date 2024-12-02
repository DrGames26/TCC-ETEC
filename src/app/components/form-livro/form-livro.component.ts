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

    const formData = new FormData();
    formData.append('name', this.novoLivro.name);
    formData.append('author', this.novoLivro.author);
    formData.append('genre', this.novoLivro.genre);
    formData.append('description', this.novoLivro.description);
    formData.append('usuarioPublicador', usuarioLogado.name);
    formData.append('phoneNumber', usuarioLogado.phoneNumber || ''); // Usa o telefone do usuário logado
    formData.append('picture', this.selectedFile); // Adiciona o arquivo de imagem

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
  }
}
