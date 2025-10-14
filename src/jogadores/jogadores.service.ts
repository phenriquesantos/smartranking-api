import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
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
      throw new NotFoundException(`Jogador com id ${id} não encotrado`);

    return jogador;
  }

  async obterJogadorPorEmail(email: string): Promise<Jogador | null> {
    return this.jogadorModel.findOne({ email }).exec();
  }

  async deletarJogador(id: string): Promise<void> {
    await this.obterJogadorPorId(id);
    await this.jogadorModel.deleteOne({ _id: id }).exec();
  }

  async atualizarJogador(id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
    await this.obterJogadorPorId(id);
    await this.jogadorModel
      .findOneAndUpdate({ _id: id }, { set: atualizarJogadorDto })
      .exec();
  }

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;

    if(await this.obterJogadorPorEmail(email)){
      throw new BadRequestException(`Jogador com e-mail ${email} já cadastrado!`);
    }

    const jogadorCriado = await this.jogadorModel.create(criarJogadorDto);
    return jogadorCriado.save();
  }
}
