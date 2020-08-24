import { map } from 'rxjs/operators';
import { CategoriaService } from './../../categorias/categoria.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

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

  public pessoas = [
    {label: 'João da Silva', value: 1},
    {label: 'Sebastião Souza', value: 2},
    {label: 'Maria Abadia', value: 3},
  ];

  constructor(
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  salvar(form: NgForm) {

  }

  carregarCategorias() {
    this.categoriaService.pesquisarTodas().subscribe(categorias => {
      this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }));
    }
    );
  }

}
