import { Injectable, NotFoundException } from '@nestjs/common';
import { JogadorDto } from './dtos/jogador.dto';
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

  async obterJogadorPorId(id: string): Promise<Jogador> {
    const jogador = await this.jogadorModel.findOne({ _id: id }).exec();
    if (!jogador)
      throw new NotFoundException('jogador não encotrado');

    return jogador;
  }

  async obterJogadorPorEmail(email: string): Promise<Jogador | null> {
    return this.jogadorModel.findOne({ email }).exec();
  }

  async deletarJogador(email: string): Promise<void> {
    await this.jogadorModel.deleteOne({ email }).exec();
  }

  async atualizarJogador(id: string, jogadorDto: JogadorDto): Promise<Jogador | null> {
    return this.jogadorModel
      .findOneAndUpdate({ id: id }, { set: jogadorDto })
      .exec();
  }

  async criarJogador(jogadorDto): Promise<Jogador> {
    const jogadorCriado = await this.jogadorModel.create(jogadorDto);
    return jogadorCriado.save();
  }
}
