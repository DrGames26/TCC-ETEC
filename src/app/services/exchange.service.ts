import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private apiUrl = 'https://sorobooks-backend.onrender.com/api/exchange'; // URL base para a API

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  // Criar solicitação de troca
  requestExchange(requestData: any): Observable<any> {
    const formattedRequestData = {
      requestedBook: requestData.requestedBook ? {
        id: requestData.requestedBook.id,
        name: requestData.requestedBook.name || 'Título não disponível',
        author: requestData.requestedBook.author || 'Autor não disponível',
        description: requestData.requestedBook.description || 'Descrição não disponível',
        genre: requestData.requestedBook.genre || 'Gênero não disponível',
        picture: requestData.requestedBook.picture || 'Imagem não disponível',
        usuarioPublicador: requestData.requestedBook.usuarioPublicador || 'Usuário não disponível'
      } : {},
      
      offeredBook: requestData.offeredBook ? {
        id: requestData.offeredBook.id,
        name: requestData.offeredBook.name || 'Título não disponível',
        author: requestData.offeredBook.author || 'Autor não disponível',
        description: requestData.offeredBook.description || 'Descrição não disponível',
        genre: requestData.offeredBook.genre || 'Gênero não disponível',
        picture: requestData.offeredBook.picture || 'Imagem não disponível',
        usuarioPublicador: requestData.offeredBook.usuarioPublicador || 'Usuário não disponível'
      } : {},
      
      requester: requestData.requester
    };
    
    
  
    return this.http.post(`${this.apiUrl}/request`, formattedRequestData).pipe(
      tap({
        next: () => {
          this.toastr.success('Solicitação de troca enviada!', 'Sucesso');
        },
        error: (error) => {
          console.error('Erro ao enviar solicitação de troca:', error);
          this.toastr.error('Erro ao enviar solicitação de troca.', 'Erro');
        }
      })
    );
  }

  // Listar solicitações pendentes
  getPendingExchanges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`).pipe(
      tap({
        error: (error) => {
          console.error('Erro ao obter solicitações pendentes:', error);
          this.toastr.error('Erro ao carregar solicitações pendentes.', 'Erro');
        }
      })
    );
  }

  // Aceitar solicitação de troca
  acceptExchange(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status: 'ACCEPTED' }).pipe(
      tap({
        next: (response) => {
          this.toastr.success('Solicitação de troca aceita!', 'Sucesso');
        },
        error: (error) => {
          console.error('Erro ao aceitar solicitação de troca:', error);
          this.toastr.error('Erro ao aceitar solicitação.', 'Erro');
        }
      })
    );
  }
  

  // Recusar solicitação de troca
  rejectExchange(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status: 'REJECTED' }).pipe(  // Enviando status como string
      tap({
        next: () => {
          this.toastr.success('Solicitação de troca recusada!', 'Sucesso');
        },
        error: (error) => {
          console.error('Erro ao recusar solicitação de troca:', error);
          this.toastr.error('Erro ao recusar solicitação.', 'Erro');
        }
      })
    );
  }
}
