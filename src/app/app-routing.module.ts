import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/config/home.component';
import { LivrosComponent } from './components/livros/livros.component';
import { FormLivroComponent } from './components/form-livro/form-livro.component';
import { LivroDetalhesComponent } from './components/livro-detalhes/livro-detalhes.component';
import { SuporteComponent } from './components/suporte/suporte.component';
import { EquipeComponent } from './components/equipe/equipe.component';
import { LoginComponent } from './login/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { EstanteComponent } from './components/estante/estante.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'livros', component: LivrosComponent },
  { path: 'livro/:id', component: LivroDetalhesComponent },
  { path: 'form-livro', component: FormLivroComponent },
  { path: 'suporte', component: SuporteComponent},
  { path: 'equipe', component: EquipeComponent},
  { path: 'cadastro', component: CadastroComponent},
  { path: 'estante', component: EstanteComponent},
  { path: 'login', component: LoginComponent},
  { path: 'perfil', component: PerfilComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
