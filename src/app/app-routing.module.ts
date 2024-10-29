import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/config/home.component';
import { LivrosComponent } from './components/livros/livros.component';
import { SuporteComponent } from './components/suporte/suporte.component';
import { EquipeComponent } from './components/equipe/equipe.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'livros', component: LivrosComponent },
  { path: 'suporte', component: SuporteComponent},
  { path: 'equipe', component: EquipeComponent},
  { path: 'cadastro', component: CadastroComponent},
  { path: 'perfil', component: PerfilComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
