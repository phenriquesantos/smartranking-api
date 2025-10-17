import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Desafio, Partida } from './interfaces/desafio';
import { CriarDesafioDto } from 'src/desafios/dtos/criar-desafio.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { DesafioStatus } from './enums/desafio-status.enum';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { AdicionarPartidaDesafioDto } from './dtos/adicionar-partida-desafio.dto';

@Injectable()
export class DesafiosService {

  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) { }

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const { jogadores, solicitante } = criarDesafioDto;

    const [jogador1, jogador2, solicitanteEncotrado] = await Promise.all([
      await this.jogadoresService.obterJogadorPorId(jogadores[0]._id),
      await this.jogadoresService.obterJogadorPorId(jogadores[1]._id),
      await this.jogadoresService.obterJogadorPorId(solicitante._id),
    ]);

    if (!jogador1 || !jogador2)
      throw new BadRequestException('É necessario ter dois jogadores ' +
        'para cadastrar um desafio');

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
      .populate(['jogadores', 'solicitante', 'partida']).exec();
  }

  async listarDesafiosJogador(jogadorId: any): Promise<Desafio[]> {
    return this.desafioModel.find().where('jogadores').in(jogadorId)
      .populate(['jogadores', 'solicitante', 'partida']).exec()
  }

  async atualizarDesafio(id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
    await this.obterDesafioPorId(id);
    const dataHoraResposta = 
      atualizarDesafioDto.status == DesafioStatus.ACEITO ?
      new Date() : null;
  
    await this.desafioModel.findOneAndUpdate({ _id: id },
      { $set: { ...atualizarDesafioDto, dataHoraResposta } }).exec();
  }

  async cancelarDesafio(id: string): Promise<void> {
    await this.obterDesafioPorId(id);
    await this.desafioModel.findOneAndUpdate({ _id: id },
      { $set: { status: DesafioStatus.CANCELADO } }).exec();
  }

  async adicionarPartidaDesafio(
    desafioId: string,
    adicionarPartidaDesafioDto: AdicionarPartidaDesafioDto,
  ): Promise<void>{
    const desafio = await this.obterDesafioPorId(desafioId);
    const { resultado, def } = adicionarPartidaDesafioDto;
    const jogadorDesafio = desafio.jogadores.find(jogadorId => jogadorId == def);
    if (!jogadorDesafio) 
      throw new BadRequestException('jogador vencedor não pertence a este desafio');

    const partida = await this.partidaModel.create({
      def,
      resultado,
      jogadores: desafio.jogadores,
      categoria: desafio.categoria,
    });

    desafio.partida = await partida.save();
    desafio.status = DesafioStatus.REALIZADO;

    try{
      await desafio.save();
    }catch(error){
      await this.partidaModel.findOneAndDelete({ _id: partida._id }).exec();
      throw new InternalServerErrorException('Não foi possivel adicionar a partida ao desafio');
    }
  }

  private async obterDesafioPorId(id: string): Promise<Desafio> {
    const desafio = await this.desafioModel.findOne({ _id: id })
      .exec();

    if (!desafio)
      throw new NotFoundException(`desafio com id ${id} não encotrado`);

    return desafio;
  }

}
