import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor(
    private readonly jogadorService: JogadoresService,
  ) { }

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() jogadorDto: CriarJogadorDto
  ) {
    return this.jogadorService.criarJogador(jogadorDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() jogadorDto: AtualizarJogadorDto,
    @Param('id', ValidacaoParametrosPipe) id: string
  ): Promise<void> {
    return this.jogadorService.atualizarJogador(id, jogadorDto);
  }

  @Get()
  async listarJogadores(): Promise<Jogador[]> {
    return this.jogadorService.listarJogadores();
  }

  @Get('/:id')
  async obterJogadorPorId(
    @Param('id') id: string
  ): Promise<Jogador> {
    const jogador = await this.jogadorService.obterJogadorPorId(id);

    return jogador;
  }

  @Delete('/:id')
  async deletarJogador(
    @Param('id', ValidacaoParametrosPipe) id: string
  ): Promise<void> {
    await this.jogadorService.deletarJogador(id);
  }
}
