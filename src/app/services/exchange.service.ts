import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr'; 
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private apiUrl = 'POST https://sorobooks-backend.onrender.com/api/exchange/request';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  // Criar solicitação de troca
  requestExchange(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, requestData);
  }

  // Listar solicitações pendentes
  getPendingExchanges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
  }

  // Aceitar solicitação de troca
  acceptExchange(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/accept/${id}`, {}).pipe(
      // Usando RxJS para lidar com a resposta e exibir a notificação
      tap(() => {
        this.toastr.success('Solicitação de troca aceita!', 'Sucesso');
      }, () => {
        this.toastr.error('Erro ao aceitar solicitação.', 'Erro');
      })
    );
  }

  // Recusar solicitação de troca
  rejectExchange(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reject/${id}`, {}).pipe(
      // Usando RxJS para lidar com a resposta e exibir a notificação
      tap(() => {
        this.toastr.success('Solicitação de troca recusada!', 'Sucesso');
      }, () => {
        this.toastr.error('Erro ao recusar solicitação.', 'Erro');
      })
    );
  }
}
