import { Body, Controller, Delete, Get, HttpCode, HttpException, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { JogadorDto } from './dtos/jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor(
    private readonly jogadorService: JogadoresService,
  ) { }

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() jogadorDto: JogadorDto
  ) {
    await this.jogadorService.criarJogador(jogadorDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() jogadorDto: JogadorDto,
    @Param('id', JogadoresValidacaoParametrosPipe) id: string
  ) {
    await this.jogadorService.atualizarJogador(id, jogadorDto);
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
    @Param('id', JogadoresValidacaoParametrosPipe) id: string
  ): Promise<void> {
    await this.jogadorService.deletarJogador(id);
  }
}
