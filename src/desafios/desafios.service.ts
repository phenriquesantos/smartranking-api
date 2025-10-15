import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Desafio } from './interfaces/desafio';
import { CriarDesafioDto } from 'src/desafios/dtos/criar-desafio.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { DesafioStatus } from './enums/desafio-status.enum';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';

@Injectable()
export class DesafiosService {

  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) { }

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const { jogadores, solicitante } = criarDesafioDto;

    const jogador1 = await this.jogadoresService.obterJogadorPorId(jogadores[0]._id);
    const jogador2 = await this.jogadoresService.obterJogadorPorId(jogadores[1]._id);
    if (!jogador1 || !jogador2)
      throw new BadRequestException('é necessario ter dois jogadores ' +
        'para cadastrar um desafio');

    const solicitanteEncotrado = await this.jogadoresService.obterJogadorPorId(solicitante._id);
    if (!solicitanteEncotrado)
      throw new BadRequestException('Solicitante não encotrado');

    if (solicitanteEncotrado.id != jogador1.id && solicitanteEncotrado.id != jogador2.id)
      throw new BadRequestException('Solicitante deve ser um dos jogadores');

    const categoriaSolicitante = await this.categoriasService
      .obterCategoriaPorJogadorId(solicitanteEncotrado._id);
    if (!categoriaSolicitante)
      throw new BadRequestException('Solicitante deve fazer parte de uma categoria');

    const desafioCriado = await this.desafioModel.create({
      ...criarDesafioDto,
      categoria: categoriaSolicitante.categoria,
      dataHoraSolicitacao: new Date(),
      status: DesafioStatus.PENDENTE,
    });

    return desafioCriado.save();
  }

  async listarDesafios(): Promise<Desafio[]> {
    return this.desafioModel.find()
      .populate(['jogadores', 'solicitante']).exec();
  }

  async listarDesafiosJogador(jogadorId: any): Promise<Desafio[]> {
    return this.desafioModel.find().where('jogadores').in(jogadorId)
      .populate(['jogadores', 'solicitante']).exec()
  }

  async atualizarDesafio(id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
    const desafio = await this.obterDesafioPorId(id);
    await this.desafioModel.findOneAndUpdate({ _id: id },
      { $set: atualizarDesafioDto }).exec();
  }

  async cancelarDesafio(id: string): Promise<void> {
    await this.obterDesafioPorId(id);
    await this.desafioModel.findOneAndUpdate({ _id: id },
      { $set: { status: DesafioStatus.CANCELADO } }).exec();
  }

  private async obterDesafioPorId(id: string): Promise<Desafio | null> {
    const desafio = await this.desafioModel.findOne({ _id: id })
      .exec();

    if (!desafio)
      throw new NotFoundException(`desafio com id ${id} não encotrado`);

    return desafio;
  }

}
