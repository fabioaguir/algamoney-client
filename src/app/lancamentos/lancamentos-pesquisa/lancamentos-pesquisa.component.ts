import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/seguranca/auth.service';

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
    private servive: LancamentoService,
    public auth: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title
    ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de lançamentos');
  }

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
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Lançamento excluído com sucesso'});
    });
  }
}
