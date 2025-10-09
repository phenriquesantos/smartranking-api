import { Body, Controller, Get, HttpCode, HttpException, Param, Post, Query } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor(
    private readonly jogadorService: JogadoresService,
  ) { }

  @Post()
  async criarAtualizarJogador(
    @Body() criarJogadorDto: CriarJogadorDto
  ) {
    await this.jogadorService.criarAtualizarJogador(criarJogadorDto);
  }

  @Get()
  async listarJogadores(
    @Query('email') email: string,
  ) {
    if (email) {
      const jogador = await this.jogadorService.obterJogadorPorEmail(email);
      if (!jogador) throw new HttpException('jogador não encotrado', 404);

      return jogador;
    }

    return this.jogadorService.listarJogadores();
  }
}
