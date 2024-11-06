import { Component, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';  // Serviço para listar os livros do usuário
import { ExchangeService } from '../../services/exchange.service';  // Serviço de trocas
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Livro } from '../../services/livro.service';  // Importando a interface Livro
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trocar-livro',
  templateUrl: './trocar-livro.component.html',
  styleUrls: ['./trocar-livro.component.css']
})
export class TrocarLivroComponent implements OnInit {
  livroDesejado: Livro | null = null;  // Livro desejado por outro usuário
  meusLivros: Livro[] = [];  // Lista de livros do usuário logado

  constructor(
    private livroService: LivroService,  
    private exchangeService: ExchangeService,  
    private toastr: ToastrService,  
    private router: Router,
    private authService: AuthService,  
    private route: ActivatedRoute  
  ) {}

  ngOnInit(): void {
    const usuarioPublicador = this.authService.getUser()?.name || '';  // Usando o nome do usuário para buscar seus livros

    // Obtendo os livros do usuário logado para trocar
    this.livroService.getBooksByUsuarioPublicador(usuarioPublicador).subscribe(
      (data: Livro[]) => {
        this.meusLivros = data;  // Atribuindo a lista de livros do usuário
      },
      (error: any) => {
        this.toastr.error('Erro ao carregar seus livros.', 'Erro');
      }
    );
    
    // Obter o livro desejado a partir da URL
    this.route.paramMap.subscribe(params => {
      const livroId = params.get('livroId');
      if (livroId) {
        this.livroService.getLivroPorId(Number(livroId)).subscribe(
          (livro: Livro) => {
            this.livroDesejado = livro;  // Atribuindo o livro desejado para troca
          },
          () => {
            this.toastr.error('Erro ao carregar os detalhes do livro.', 'Erro');
          }
        );
      }
    });
  }

  // Função para solicitar troca
  offerExchange(livroId: number): void {
    const troca = {
      bookOfferedId: livroId,
      bookRequestedId: this.livroDesejado?.id,  // Utilizando o livro desejado
    };

    this.exchangeService.requestExchange(troca).subscribe(
      () => {
        this.toastr.success('Troca solicitada com sucesso!', 'Sucesso');
        this.router.navigate(['/trocas']);  // Redireciona para a página da conta do usuário
      },
      () => {
        this.toastr.error('Erro ao solicitar troca.', 'Erro');
      }
    );
  }
}
