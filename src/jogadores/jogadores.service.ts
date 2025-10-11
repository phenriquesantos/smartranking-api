import { Injectable, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) { }

  async listarJogadores(): Promise<Jogador[]> {
    return this.jogadorModel.find().exec();
  }

  async obterJogadorPorEmail(email: string): Promise<Jogador | null> {
    const jogador = await this.jogadorModel.findOne({ email }).exec();
    return jogador;
  }

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorEncontrado = await this.obterJogadorPorEmail(email);
    if (jogadorEncontrado)
      await this.atualizarJogador(criarJogadorDto);
    else
      await this.criarJogador(criarJogadorDto);
  }

  async deletarJogador(email: string): Promise<void> {
    await this.jogadorModel.findOneAndDelete({ email }).exec();
  }

  private async atualizarJogador(jogadorDto: CriarJogadorDto):Promise<Jogador | null> {
    return this.jogadorModel.findOneAndUpdate({ email: jogadorDto.email }, { set: CriarJogadorDto })
      .exec();
  }

  private async criarJogador(jogadorDto): Promise<Jogador> {
    const jogadorCriado = await this.jogadorModel.create(jogadorDto);
    return jogadorCriado.save();
  }
}
