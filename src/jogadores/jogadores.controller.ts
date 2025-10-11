import { Body, Controller, Delete, Get, HttpCode, HttpException, NotFoundException, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor(
    private readonly jogadorService: JogadoresService,
  ) { }

  @Post()
  @UsePipes(ValidationPipe)
  async criarAtualizarJogador(
    @Body() criarJogadorDto: CriarJogadorDto
  ) {
    await this.jogadorService.criarAtualizarJogador(criarJogadorDto);
  }

  @Get()
  async listarJogadores(
    @Query('email') email: string,
  ): Promise<Jogador[] | Jogador> {
    if (email) {
      const jogador = await this.jogadorService.obterJogadorPorEmail(email);
      if (jogador === null) throw new NotFoundException('jogador não encotrado');

      return jogador;
    }

    return this.jogadorService.listarJogadores();
  }

  @Delete('')
  async deletarJogador(
    @Query('email') email: string
  ): Promise<void>{
    await this.jogadorService.deletarJogador(email);
  }
}
