import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  public totalRegistros = 0;
  public filtro = new LancamentoFiltro();
  public lancamentos = [];

  @ViewChild('tabela') grid;

  constructor(
    private servive: LancamentoService
    ) { }

  ngOnInit() {}

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.servive.pesquisar(this.filtro).subscribe((response: any) => {
      this.lancamentos = response.lancamentos;
      this.totalRegistros = response.total;
    });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  excluir(lancamento: any) {
    this.servive.excluir(lancamento.codigo).subscribe(response => {
      this.grid.reset();
    });
  }
}
