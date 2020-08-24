import { MessageService } from 'primeng/api';
import { Lancamento } from './../../core/model';
import { map } from 'rxjs/operators';
import { CategoriaService } from './../../categorias/categoria.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { LancamentoService } from '../lancamento.service';

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
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarPessoas();
  }

  salvar(form: NgForm) {
    this.lancamentoService.salvar(this.lancamento).subscribe(resonse => {
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Lançamento adicionado com sucesso'});

      form.reset();
      this.lancamento = new Lancamento();
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

}
