import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private apiUrl = 'https://sorobooks-backend.onrender.com/api/exchange';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  // Criar solicitação de troca
  requestExchange(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, requestData).pipe(
      tap(() => {
        this.toastr.success('Solicitação de troca enviada!', 'Sucesso');
      }, () => {
        this.toastr.error('Erro ao enviar solicitação de troca.', 'Erro');
      })
    );
  }

  // Listar solicitações pendentes
  getPendingExchanges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
  }

  // Aceitar solicitação de troca
  acceptExchange(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status: 'ACEITAR' }).pipe(
      tap(() => {
        this.toastr.success('Solicitação de troca aceita!', 'Sucesso');
      }, () => {
        this.toastr.error('Erro ao aceitar solicitação.', 'Erro');
      })
    );
  }

  // Recusar solicitação de troca
  rejectExchange(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status: 'RECUSAR' }).pipe(
      tap(() => {
        this.toastr.success('Solicitação de troca recusada!', 'Sucesso');
      }, () => {
        this.toastr.error('Erro ao recusar solicitação.', 'Erro');
      })
    );
  }
}
