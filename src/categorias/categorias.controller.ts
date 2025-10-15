import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(
    private readonly categoriasService: CategoriasService
  ){}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria>{
    return this.categoriasService.criarCategoria(criarCategoriaDto);
  }

  @Get()
  async listarCategorias(): Promise<Categoria[]>{
    return this.categoriasService.listarCategorias();
  }

  @Get('/:id')
  async obterCategoriaPorId(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ){
    return this.categoriasService.obterCategoriaPorId(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void>{
    await this.categoriasService.atualizarCategoria(id, atualizarCategoriaDto);
  }

  @Post('/:categoriaNome/jogadores/:jogadorId')
  async adicionarJogadorCategoria(
    @Param() params: string[],
  ): Promise<void> {
    await this.categoriasService.adicionarJogadorCategoria(params);
  }
}
