import { Body, Controller, Get, HttpCode, HttpException, Param, Post } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor(
    private readonly jogadorService: JogadoresService,
  ) {  }

  @Post()
  async criarAtualizarJogador(
    @Body() criarJogadorDto: CriarJogadorDto
  ){
    await this.jogadorService.criarAtualizarJogador(criarJogadorDto);
  }

  @Get()
  async listarJogadores(){
    return this.jogadorService.listarJogadores();
  }

  @Get('/:email')
  async obterJogadorPorEmail(
    @Param('email') email: string
  ){
    const jogador = await this.jogadorService.obterJogadorPorEmail(email);
    if(!jogador) throw new HttpException('jogador não encotrado', 404);
    
    return jogador;
  }
}
