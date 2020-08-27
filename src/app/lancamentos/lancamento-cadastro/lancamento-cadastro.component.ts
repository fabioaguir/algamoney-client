import { MessageService } from 'primeng/api';
import { Lancamento } from './../../core/model';
import { map } from 'rxjs/operators';
import { CategoriaService } from './../../categorias/categoria.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { LancamentoService } from '../lancamento.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  public tipos = [
    {label: 'Receita', value: 'RECEITA'},
    {label: 'Despesa', value: 'DESPESA'},
  ];

  public categorias = [];
  public pessoas = [];
  lancamento = new Lancamento();

  constructor(
    private categoriaService: CategoriaService,
    private pessoaServive: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.parametrosDaRota();
    this.carregarCategorias();
    this.carregarPessoas();
  }

  private parametrosDaRota() {
    this.route.params.subscribe((params: Params) => {
      if(params.codigo) {
        this.carregarLancamento(params.codigo);
      }
    });
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo).subscribe((lancamento: Lancamento) => {
      this.lancamento = lancamento;
    });
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  salvar(form: NgForm){
    if(this.editando) {
      this.atualizarLacamento(form);
    } else {
      this.adicionarLacamento(form);
    }
  }

  adicionarLacamento(form: NgForm) {
    this.lancamentoService.salvar(this.lancamento).subscribe(lancamento => {
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Lançamento adicionado com sucesso'});

      this.router.navigate(['/lancamentos', lancamento.codigo]);
      }
    );
  }

  atualizarLacamento(form: NgForm) {
    this.lancamentoService.atualizar(this.lancamento).subscribe(lancamento => {
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Lançamento atualizado com sucesso'});
      this.lancamento = lancamento;
      }
    );
  }

  carregarCategorias() {
    this.categoriaService.pesquisarTodas().subscribe(categorias => {
      this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }));
      }
    );
  }

  carregarPessoas() {
    this.pessoaServive.pesquisarTodas().subscribe(pessoas => {
      this.pessoas = pessoas.map(p => ({ label: p.nome, value: p.codigo }));
    }
    );
  }

  novo(form: NgForm) {
    form.reset();

    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);
    this.router.navigate(['/lacamentos/novo']);
  }

}
