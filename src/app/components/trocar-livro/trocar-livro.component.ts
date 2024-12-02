import { Component, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';  
import { ExchangeService } from '../../services/exchange.service';
import { AuthService } from '../../services/auth.service';  
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Livro } from '../../services/livro.service';  

@Component({
  selector: 'app-trocar-livro',
  templateUrl: './trocar-livro.component.html',
  styleUrls: ['./trocar-livro.component.css']
})
export class TrocarLivroComponent implements OnInit {
  livroDesejado: Livro | null = null;  
  meusLivros: Livro[] = [];  

  constructor(
    private livroService: LivroService,  
    private exchangeService: ExchangeService,  
    private toastr: ToastrService,  
    private router: Router,
    private authService: AuthService,  
    private route: ActivatedRoute  
  ) {}

  ngOnInit(): void {
    const usuarioPublicador = this.authService.getUser()?.name || '';  

    // Carregar os livros do localStorage ou da API
    this.loadBooksFromStorageOrApi(usuarioPublicador);

    // Carregar detalhes do livro desejado
    this.route.paramMap.subscribe(params => {
      const livroId = params.get('livroId');
      if (livroId) {
        this.livroService.getLivroPorId(Number(livroId)).subscribe(
          (livro: Livro) => {
            this.livroDesejado = livro;
          },
          (error) => console.error('Erro ao carregar o livro desejado:', error)
        );
      }
    });
  }

  // Método para carregar os livros do localStorage ou da API
  private loadBooksFromStorageOrApi(usuarioPublicador: string): void {
    const storedBooks = localStorage.getItem('meusLivros');
    if (storedBooks) {
      try {
        this.meusLivros = JSON.parse(storedBooks);
        console.log('Livros carregados do localStorage:', this.meusLivros);
      } catch (error) {
        console.error('Erro ao processar livros do localStorage:', error);
      }
    }

    // Se o localStorage estiver vazio ou os livros não forem encontrados, busca da API
    if (!this.meusLivros || this.meusLivros.length === 0) {
      this.livroService.getBooksByUsuarioPublicador(usuarioPublicador).subscribe(
        (data: Livro[]) => {
          this.meusLivros = data;
          localStorage.setItem('meusLivros', JSON.stringify(data)); // Atualiza o localStorage
          console.log('Livros carregados da API e salvos no localStorage:', data);
        },
        (error) => console.error('Erro ao carregar os livros da API:', error)
      );
    }
  }

  // Função para oferecer a troca
  offerExchange(livroId: number): void {
    if (!this.livroDesejado) {
      return;
    }

    const troca = {
      offeredBook: {
        id: livroId,
      },
      requestedBook: {
        id: this.livroDesejado.id,
      },
      requester: this.authService.getUser()?.email || '',
      requesterPhoneNumber: this.authService.getUser()?.phoneNumber || ''  // Incluindo o número de telefone
    };

    console.log('Requester:', troca.requester);
    console.log('PhoneNumber:', troca.requesterPhoneNumber); // Para garantir que o número de telefone está sendo enviado corretamente

    // Solicitar a troca
    this.exchangeService.requestExchange(troca).subscribe(
      (response) => {
        if (response && response.success) {
          this.toastr.success('Troca solicitada com sucesso!', 'Sucesso');
          // Redirecionar para a página de trocas
          this.router.navigateByUrl('/trocas');
        }
      }
    );
  }
}
