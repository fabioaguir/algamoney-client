import { Title } from '@angular/platform-browser';
import { LazyLoadEvent, MessageService, ConfirmationService } from 'primeng/api';
import { PessoaService } from './../pessoa.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PessoaFiltro } from '../pessoa.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  public totalRegistros = 0;
  public filtro = new PessoaFiltro();
  pessoas = [];

  @ViewChild('tabela') grid;

  constructor(
    private servive: PessoaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title
    ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.servive.pesquisar(this.filtro).subscribe((response: any) => {
      this.pessoas = response.pessoas;
      this.totalRegistros = response.total;
    });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any) {
    this.confirmationService.confirm({
        message: 'Tem certeza que deseja excluir?',
        accept: () => {
            this.excluir(lancamento);
        }
    });
  }

  excluir(lancamento: any) {
    this.servive.excluir(lancamento.codigo).subscribe(response => {
      this.grid.reset();
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Pessoa excluída com sucesso'});
    });
  }

  mudarStatus(pessoa: any) {
    const status = pessoa.ativo ? false : true;
    this.servive.mudarStatus(pessoa.codigo, status).subscribe(response => {
      this.grid.reset();
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Status alterado com sucesso'});
    });
  }
}
