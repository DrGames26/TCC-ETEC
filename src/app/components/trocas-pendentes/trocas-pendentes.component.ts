import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service'; // Serviço que busca os dados
import { ToastrService } from 'ngx-toastr'; // Para exibir mensagens de notificação
import { AuthService } from 'src/app/services/auth.service'; // Serviço de autenticação
import { LivroService } from 'src/app/services/livro.service'; // Serviço para buscar livros do usuário

@Component({
  selector: 'app-trocas-pendentes',
  templateUrl: './trocas-pendentes.component.html',
  styleUrls: ['./trocas-pendentes.component.css']
})
export class TrocasPendentesComponent implements OnInit {
  pendentes: any[] = [];
  aceitas: any[] = [];
  recusadas: any[] = [];
  livrosDoUsuario: any[] = []; // Lista de livros do usuário

  constructor(
    private exchangeService: ExchangeService, // Serviço que interage com o backend
    private toastr: ToastrService, // Para exibir notificações
    private authService: AuthService, // Serviço de autenticação
    private livroService: LivroService // Serviço para buscar livros do usuário
  ) {}

  ngOnInit(): void {
    this.loadUserBooks(); // Carregar os livros do usuário
  }

  loadUserBooks(): void {
    const usuario = this.authService.getUser();
    if (usuario && usuario.email) {
      this.livroService.getBooksByUsuarioPublicador(usuario.email).subscribe(
        (livros) => {
          this.livrosDoUsuario = livros; // Armazena os livros do usuário
          this.loadExchanges(); // Carrega as trocas após os livros serem carregados
        },
        (error) => {
          this.toastr.error('Erro ao carregar os livros do usuário.', 'Erro');
        }
      );
    }
  }

  loadExchanges(): void {
    // Chama o serviço para buscar as trocas pendentes do backend
    this.exchangeService.getPendingExchanges().subscribe(
      (data) => {
        // Filtra as trocas de acordo com o status (PENDING, ACCEPTED, REJECTED)
        this.pendentes = data.filter(exchange => {
          // Verifica se o usuário tem o livro solicitado
          return this.livrosDoUsuario.some(livro => livro.id === exchange.requestedBook.id);
        });
        this.aceitas = data.filter(exchange => exchange.status === 'ACCEPTED');
        this.recusadas = data.filter(exchange => exchange.status === 'REJECTED');
      },
      (error) => {
        this.toastr.error('Erro ao carregar as solicitações de troca.', 'Erro');
      }
    );
  }

  acceptExchange(id: number): void {
    // Encontre a troca pendente pelo ID
    const exchange = this.pendentes.find(e => e.id === id);
    if (!exchange || !exchange.offeredBook || !exchange.offeredBook.phoneNumber || !exchange.requestedBook) {
      this.toastr.error('Informações da troca incompletas.', 'Erro');
      console.log('Troca não encontrada ou informações ausentes', exchange);
      return;
    }

    // Informações necessárias
    const phoneNumber = exchange.offeredBook.phoneNumber; // Número do solicitante
    const requestedBook = exchange.requestedBook; // Livro solicitado

    // Monta a mensagem com informações do livro solicitado
    const message = `Olá, estou aceitando a troca do livro "${requestedBook.name}" (autor: ${requestedBook.author}). Podemos alinhar os detalhes?`;

    console.log('Mensagem gerada para o WhatsApp:', message);

    // Chama o serviço para aceitar a troca
    this.exchangeService.acceptExchange(id).subscribe(
      () => {
        this.toastr.success('Solicitação de troca aceita!', 'Sucesso');
        this.loadExchanges(); // Recarrega as trocas após aceitar

        // Redireciona para o WhatsApp com a mensagem personalizada
        window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      },
      () => {
        this.toastr.error('Erro ao aceitar solicitação.', 'Erro');
      }
    );
  }

  rejectExchange(id: number): void {
    // Rejeita a troca e recarrega as trocas pendentes
    this.exchangeService.rejectExchange(id).subscribe(
      () => {
        this.toastr.success('Solicitação de troca recusada!', 'Sucesso');
        this.loadExchanges(); // Recarrega as trocas após recusar
      },
      () => {
        this.toastr.error('Erro ao recusar solicitação.', 'Erro');
      }
    );
  }
}
