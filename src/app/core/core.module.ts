import { DashboardService } from './../dashboard/dashboard.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { CategoriaService } from './../categorias/categoria.service';
import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from './../seguranca/auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './nao-autorizado.component';


@NgModule({
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent
  ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [
    ConfirmationService,
    MessageService,
    ErrorHandlerService,
    CategoriaService,
    AuthService,
    DashboardService
  ]
})
export class CoreModule { }
