import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/config/home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LivrosComponent } from './components/livros/livros.component';
import { SuporteComponent } from './components/suporte/suporte.component';
import { EquipeComponent } from './components/equipe/equipe.component';
import { AppRoutingModule } from './app-routing.module';
import { LivroService } from './services/livro.service';
import { LoginComponent } from './login/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { CadastroUsuarioService } from './services/cadastro-usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ListaLivrosComponent } from './components/lista-livros/lista-livros.component';
import { FormLivroComponent } from './components/form-livro/form-livro.component';
import { LivroDetalhesComponent } from './components/livro-detalhes/livro-detalhes.component';
import { EstanteComponent } from './components/estante/estante.component';
import { TrocasPendentesComponent } from './components/trocas-pendentes/trocas-pendentes.component';
import { TrocarLivroComponent } from './components/trocar-livro/trocar-livro.component';
import { AdmComponent } from './components/adm/adm.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PerfilComponent,
    LivrosComponent,
    SuporteComponent,
    EquipeComponent,
    LoginComponent,
    CadastroComponent,
    ListaLivrosComponent,
    FormLivroComponent,
    LivroDetalhesComponent,
    EstanteComponent,
    TrocasPendentesComponent,
    TrocarLivroComponent,
    AdmComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule  
  ],
  providers: [LivroService, CadastroUsuarioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
