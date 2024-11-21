import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service'; // Importe o serviço que irá buscar os dados
import { ToastrService } from 'ngx-toastr'; // Importe o Toastr para exibir mensagens
import { AuthService } from '../../services/auth.service'; // Serviço para obter o usuário autenticado

@Component({
  selector: 'app-trocas-pendentes',
  templateUrl: './trocas-pendentes.component.html',
  styleUrls: ['./trocas-pendentes.component.css']
})
export class TrocasPendentesComponent implements OnInit {
  pendentes: any[] = [];
  aceitas: any[] = [];
  recusadas: any[] = [];

  constructor(
    private exchangeService: ExchangeService, // Serviço que interage com o backend
    private toastr: ToastrService,  // Para exibir notificações
    private authService: AuthService // Para obter o usuário autenticado
  ) {}

  ngOnInit(): void {
    this.loadExchanges(); // Chama o método que carrega as trocas
  }

  loadExchanges(): void {
    const loggedUserEmail = this.authService.getAuthenticatedUserEmail(); // Método para obter o e-mail do usuário autenticado
    
    // Chama o serviço para buscar as trocas pendentes do backend
    this.exchangeService.getPendingExchanges().subscribe(
      (data) => {
        // Filtra as trocas de acordo com o status (PENDING, ACCEPTED, REJECTED)
        this.pendentes = data.filter(exchange => exchange.status === 'PENDING' && exchange.requester === loggedUserEmail);
        this.aceitas = data.filter(exchange => exchange.status === 'ACCEPTED' && exchange.requester === loggedUserEmail);
        this.recusadas = data.filter(exchange => exchange.status === 'REJECTED' && exchange.requester === loggedUserEmail);
      },
      (error) => {
        this.toastr.error('Erro ao carregar as solicitações de troca.', 'Erro');
      }
    );
  }

  acceptExchange(id: number): void {
    this.exchangeService.acceptExchange(id).subscribe(
      () => {
        this.toastr.success('Solicitação de troca aceita!', 'Sucesso');
        this.loadExchanges(); // Recarrega as trocas após aceitar
      },
      () => {
        this.toastr.error('Erro ao aceitar solicitação.', 'Erro');
      }
    );
  }

  rejectExchange(id: number): void {
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
