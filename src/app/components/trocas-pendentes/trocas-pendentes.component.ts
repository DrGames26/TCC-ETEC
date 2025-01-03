import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service'; // Serviço que interage com o backend
import { ToastrService } from 'ngx-toastr'; // Para exibir mensagens de notificação
import { AuthService } from 'src/app/services/auth.service'; // Serviço de autenticação
import { LivroService } from 'src/app/services/livro.service'; // Serviço de livros

@Component({
  selector: 'app-trocas-pendentes',
  templateUrl: './trocas-pendentes.component.html',
  styleUrls: ['./trocas-pendentes.component.css']
})
export class TrocasPendentesComponent implements OnInit {
  pendentes: any[] = [];
  aceitas: any[] = [];
  recusadas: any[] = [];
  livrosDoUsuario: any[] = [];

  constructor(
    private exchangeService: ExchangeService, // Serviço que interage com o backend
    private toastr: ToastrService, // Para exibir notificações
    private authService: AuthService, // Serviço de autenticação
    private livroService: LivroService // Serviço de livros
  ) {}

  ngOnInit(): void {
    this.loadExchanges(); // Carrega as trocas
    this.loadLivrosUsuario(); // Carrega os livros do usuário logado
  }

  loadExchanges(): void {
    this.exchangeService.getPendingExchanges().subscribe(
      (data) => {
        // Filtra as trocas de acordo com o status
        this.pendentes = data.filter(exchange =>
          exchange.status === 'PENDING' && this.livroSolicitadoPertenceAoUsuario(exchange)
        );
        this.aceitas = data.filter(exchange => exchange.status === 'ACCEPTED');
        this.recusadas = data.filter(exchange => exchange.status === 'REJECTED');
      },
      (error) => {
        this.toastr.error('Erro ao carregar as solicitações de troca.', 'Erro');
      }
    );
  }

  loadLivrosUsuario(): void {
    const usuarioLogado = this.authService.getUser(); // Obtém o usuário logado
    if (usuarioLogado) {
      this.livroService.getBooksByUsuarioPublicador(usuarioLogado.name).subscribe(
        (data) => {
          this.livrosDoUsuario = data; // Armazena os livros do usuário logado
        },
        (error) => {
          console.error('Erro ao carregar livros do usuário', error);
        }
      );
    }
  }

  livroSolicitadoPertenceAoUsuario(exchange: any): boolean {
    // Verifica se o livro solicitado pertence ao usuário logado
    return this.livrosDoUsuario.some(livro => livro.id === exchange.requestedBook.id);
  }

  acceptExchange(id: number): void {
    const exchangeIndex = this.pendentes.findIndex(e => e.id === id);
    if (exchangeIndex === -1) {
      this.toastr.error('Troca não encontrada.', 'Erro');
      return;
    }

    const exchange = this.pendentes[exchangeIndex];
    if (!exchange || !exchange.offeredBook || !exchange.requestedBook) {
      this.toastr.error('Informações da troca incompletas.', 'Erro');
      return;
    }

    const phoneNumber = exchange.offeredBook.phoneNumber; // Número do solicitante
    const requestedBook = exchange.requestedBook; // Livro solicitado
    const message = `Olá, estou aceitando a troca do livro "${requestedBook.name}" (autor: ${requestedBook.author}). Podemos alinhar os detalhes?`;

    console.log('Mensagem gerada para o WhatsApp:', message);

    this.exchangeService.acceptExchange(id).subscribe(
      () => {
        this.toastr.success('Solicitação de troca aceita!', 'Sucesso');
        exchange.status = 'ACCEPTED'; // Atualiza o status localmente
        this.aceitas.push(exchange); // Move para a lista de aceitas
        this.pendentes.splice(exchangeIndex, 1); // Remove da lista de pendentes
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
      },
      () => {
        this.toastr.error('Erro ao aceitar solicitação.', 'Erro');
      }
    );
  }

  rejectExchange(id: number): void {
    const exchangeIndex = this.pendentes.findIndex(e => e.id === id);
    if (exchangeIndex === -1) {
      this.toastr.error('Troca não encontrada.', 'Erro');
      return;
    }

    const exchange = this.pendentes[exchangeIndex];

    this.exchangeService.rejectExchange(id).subscribe(
      () => {
        this.toastr.success('Solicitação de troca recusada!', 'Sucesso');
        exchange.status = 'REJECTED'; // Atualiza o status localmente
        this.recusadas.push(exchange); // Move para a lista de recusadas
        this.pendentes.splice(exchangeIndex, 1); // Remove da lista de pendentes
      },
      () => {
        this.toastr.error('Erro ao recusar solicitação.', 'Erro');
      }
    );
  }
}
