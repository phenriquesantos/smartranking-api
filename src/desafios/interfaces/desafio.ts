import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

export interface Desafio extends Document {
  dataHoraDesafio: Date;
  status: string;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: Jogador;
  categoria: String;
  jogadores: Jogador[];
  partida: Partida;
}

export interface Partida extends Document {
  def: Jogador;
  resultado: Resultado[];
  jogadores: Jogador[];
  categoria: string;
}

export interface Resultado {
  set: string;
}
