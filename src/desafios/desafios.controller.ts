import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from 'src/desafios/dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { AdicionarPartidaDesafioDto } from './dtos/adicionar-partida-desafio.dto';

@Controller('api/v1/desafios')
export class DesafiosController {

  constructor(
    private readonly desafiosService: DesafiosService
  ){}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto,
  ): Promise<Desafio>{
    return this.desafiosService.criarDesafio(criarDesafioDto);
  }

  @Get()
  async listarDesafios(): Promise<Desafio[]>{
    return this.desafiosService.listarDesafios();
  }

  @Get('/jogadores/:jogadorId')
  async listarDesafiosJogador(
    @Param('jogadorId', ValidacaoParametrosPipe) jogadorId: string,
  ): Promise<Desafio[]>{
    return this.desafiosService.listarDesafiosJogador(jogadorId);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body() atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void>{
    await this.desafiosService.atualizarDesafio(id, 
      atualizarDesafioDto);
  }

  @Delete('/:id')
  async cancelarDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void>{
    await this.desafiosService.cancelarDesafio(id);
  }

  @Post('/:id/partida')
  async adicionarPartidaDesafio(
    @Body() adicionarPartidaDesafioDto: AdicionarPartidaDesafioDto,
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void>{
    await this.desafiosService.adicionarPartidaDesafio(id, adicionarPartidaDesafioDto);
  }
}
