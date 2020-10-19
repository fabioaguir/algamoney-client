import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Lancamento } from './../../core/model';
import { CategoriaService } from './../../categorias/categoria.service';
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
  // lancamento = new Lancamento();
  public formulario: FormGroup;
  public uploadEmAndamento = false;

  constructor(
    private categoriaService: CategoriaService,
    private pessoaServive: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.configurarFormulario();
    this.parametrosDaRota();
    this.carregarCategorias();
    this.carregarPessoas();
    this.atualizarTituloEdicao();
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: [ 'RECEITA', Validators.required ],
      dataVencimento: [ null, Validators.required ],
      dataPagamento: [],
      descricao: [null, [ this.validarObrigatoriedade, this.validarTamanhoMinimo(5) ]],
      valor: [ null, Validators.required ],
      pessoa: this.formBuilder.group({
        codigo: [ null, Validators.required ],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [ null, Validators.required ],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    // const valor = input.root.get('valor')?.value;
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
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
      this.formulario.patchValue(lancamento);
      this.atualizarTituloEdicao();
    });
  }

  antesUploadAnexo(event) {
    this.uploadEmAndamento = true;
  }

  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }

  aoTerminarUploadAnexo(event) {
    const anexo = event.originalEvent.body;

    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: (anexo.url as string).replace('\\', 'https://')
    });

    this.uploadEmAndamento = false;
  }

  get nomeAnexo() {
    const nome = this.formulario.get('anexo').value;

    if (nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }

    return '';
  }

  erroUpload() {
    this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Erro ao tentar enviar anexo!'});

    this.uploadEmAndamento = false;
  }

  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null
    });
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  salvar(){
    if(this.editando) {
      this.atualizarLacamento();
    } else {
      this.adicionarLacamento();
    }
  }

  adicionarLacamento() {
    this.lancamentoService.salvar(this.formulario.value).subscribe(lancamento => {
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Lançamento adicionado com sucesso'});

      this.router.navigate(['/lancamentos', lancamento.codigo]);
      }
    );
  }

  atualizarLacamento() {
    this.lancamentoService.atualizar(this.formulario.value).subscribe(lancamento => {
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Lançamento atualizado com sucesso'});
      this.formulario.patchValue(lancamento);
      this.atualizarTituloEdicao();
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

  novo() {
    this.formulario.reset();

    setTimeout(function() {
      this.lancamento = new Lancamento();
      this.atualizarTituloEdicao();
    }.bind(this), 1);
    this.router.navigate(['lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    if(this.editando) {
      this.title.setTitle(`Edição de lançamento: ${this.formulario.get('descricao').value}`);
    } else {
      this.title.setTitle('Novo lançamento');
    }
  }
}
