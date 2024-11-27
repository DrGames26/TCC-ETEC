import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service'; // Serviço que busca os dados
import { ToastrService } from 'ngx-toastr'; // Para exibir mensagens de notificação

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
    private toastr: ToastrService // Para exibir notificações
  ) {}

  ngOnInit(): void {
    this.loadExchanges(); // Chama o método que carrega as trocas
  }

  loadExchanges(): void {
    // Chama o serviço para buscar as trocas pendentes do backend
    this.exchangeService.getPendingExchanges().subscribe(
      (data) => {
        // Filtra as trocas de acordo com o status (PENDING, ACCEPTED, REJECTED)
        this.pendentes = data.filter(exchange => exchange.status === 'PENDING');
        this.aceitas = data.filter(exchange => exchange.status === 'ACCEPTED');
        this.recusadas = data.filter(exchange => exchange.status === 'REJECTED');
      },
      (error) => {
        this.toastr.error('Erro ao carregar as solicitações de troca.', 'Erro');
      }
    );
  }

  // Método para verificar se a string é base64
  isBase64(str: string): boolean {
    const base64Pattern = /^([A-Za-z0-9+\/=]{4})*(?:[A-Za-z0-9+\/=]{2}[A-Za-z0-9+\/=]{3})?$/;
    return base64Pattern.test(str);
  }

  acceptExchange(id: number): void {
    // Lógica para aceitar a troca
  }

  rejectExchange(id: number): void {
    // Lógica para recusar a troca
  }
}
