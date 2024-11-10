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
  loadingLivros: boolean = true; // Para indicar o carregamento dos livros
  loadingLivroDesejado: boolean = true; // Para indicar o carregamento do livro desejado

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

    // Carregar os livros do usuário autenticado
    this.livroService.getBooksByUsuarioPublicador(usuarioPublicador).subscribe(
      (data: Livro[]) => {
        this.meusLivros = data;
        this.loadingLivros = false;
      },
      (error) => {
        this.toastr.error('Erro ao carregar os livros.', 'Erro');
        this.loadingLivros = false;
      }
    );
      
    // Carregar detalhes do livro desejado
    this.route.paramMap.subscribe(params => {
      const livroId = params.get('livroId');
      if (livroId) {
        this.livroService.getLivroPorId(Number(livroId)).subscribe(
          (livro: Livro) => {
            this.livroDesejado = livro;
            this.loadingLivroDesejado = false;
          },
          (error) => {
            this.toastr.error('Erro ao carregar o livro desejado.', 'Erro');
            this.loadingLivroDesejado = false;
          }
        );
      }
    });
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
      requester: this.authService.getUser()?.email || ''
    };

    console.log('Requester:', troca.requester);

    // Solicitar a troca
    this.exchangeService.requestExchange(troca).subscribe(
      (response) => {
        if (response && response.success) {
          this.toastr.success('Troca solicitada com sucesso!', 'Sucesso');
          // Redirecionar para a página de trocas
          this.router.navigate(['/trocas']);
        } else {
          this.toastr.error('Não foi possível solicitar a troca. Tente novamente.', 'Erro');
        }
      },
      (error) => {
        this.toastr.error('Erro ao solicitar a troca.', 'Erro');
      }
    );
  }
}
