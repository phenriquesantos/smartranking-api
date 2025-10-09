import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {

  private jogadores: Jogador[] = [];

  constructor(
    private readonly logger: Logger,
  ) { }

  async listarJogadores(): Promise<Jogador[]> {
    return this.jogadores;
  }

  async obterJogadorPorEmail(email: string): Promise<Jogador | undefined> {
    const jogador = this.jogadores.find(item => item.email === email);
    return jogador;
  }

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorEncontrado = await this.obterJogadorPorEmail(email);
    if (jogadorEncontrado)
      await this.atualizarJogador(jogadorEncontrado, criarJogadorDto);
    else
      await this.criarJogador(criarJogadorDto);
  }

  async atualizarJogador(jogador: Jogador, jogadorDto: CriarJogadorDto): Promise<void>{
    const { nome } = jogadorDto;
    jogador.nome = nome;
  }

  private async criarJogador(criarogadorDto): Promise<void> {
    const { nome, telefoneCelular, email } = criarogadorDto;

    const jogador: Jogador = {
      _id: uuidv4(),
      nome,
      telefoneCelular,
      email,
      posicaoRanking: 0,
      ranking: 'D',
      urlFotoJogador: ''
    }

    this.jogadores.push(jogador);
    this.logger.log(JSON.stringify(this.jogadores));
  }
}
