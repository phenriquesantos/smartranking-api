import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categoria.interface';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { NotFoundError } from 'rxjs';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) { }

  async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;
    const categoriaEncotrada = await this.categoriaModel.findOne({ categoria }).exec();
    if (categoriaEncotrada)
      throw new BadRequestException(`Categoria ${categoria} já cadastrada!`);

    const categoriaSalva = await this.categoriaModel.create(criarCategoriaDto);
    return categoriaSalva.save();
  }

  async listarCategorias() {
    return this.categoriaModel.find().exec();
  }

  async obterCategoriaPorId(id: string): Promise<Categoria> {
    const categoria = await this.categoriaModel.findOne({ _id: id })
      .populate('jogadores').exec();
    
    if (!categoria)
      throw new NotFoundException(`Categoria com id ${id} não encontrada`);

    return categoria;
  }

  async atualizarCategoria(
    id: string,
    atualizarCategoriaDto: AtualizarCategoriaDto
  ): Promise<void> {
    await this.obterCategoriaPorId(id);
    await this.categoriaModel.findOneAndUpdate({ _id: id },
      { $set: atualizarCategoriaDto }).exec();
  }

  async adicionarJogadorCategoria(params: string[]): Promise<void> {
    const categoriaNome = params['categoriaNome'];
    const jogadorId = params['jogadorId'];

    const categoria = await this.categoriaModel.findOne({ categoria: categoriaNome })
      .exec();
    
    if (!categoria) 
      throw new BadRequestException(`Categoria ${categoriaNome} não encontrada`);

    await this.jogadoresService.obterJogadorPorId(jogadorId);

    const jogadorCategoria = await this.categoriaModel.find({ categoria: categoriaNome })
        .where('jogadores').in(jogadorId).exec();

    if (jogadorCategoria.length)
      throw new BadRequestException('Jogador já cadastrado na categoria');

    categoria.jogadores.push(jogadorId);
    await this.categoriaModel.findOneAndUpdate({ categoria: categoriaNome }, 
      { $set: categoria }).exec();
  }

  async obterCategoriaPorJogadorId(jogadorId: any): Promise<Categoria | null>{
    return this.categoriaModel.findOne()
        .where('jogadores').in(jogadorId).exec();
  }
}
