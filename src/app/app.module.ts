import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
import { HomeComponent } from './components/config/home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LivrosComponent } from './components/livros/livros.component';
import { SuporteComponent } from './components/suporte/suporte.component';
import { EquipeComponent } from './components/equipe/equipe.component';
import { AppRoutingModule } from './app-routing.module';
import { LivroService } from './services/livro.service';
import { LoginComponent } from './login/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PerfilComponent,
    LivrosComponent,
    SuporteComponent,
    EquipeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule, 
    AppRoutingModule  
  ],
  providers: [LivroService],
  bootstrap: [AppComponent]
})
export class AppModule { }
