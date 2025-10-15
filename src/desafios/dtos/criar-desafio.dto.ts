import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsObject } from "class-validator";
import type { Jogador } from 'src/jogadores/interfaces/jogador.interface';

export class CriarDesafioDto {

  @IsNotEmpty()
  @IsDateString()
  dataHoraDesafio: Date;
  
  @IsNotEmpty()
  @IsObject()
  solicitante: Jogador;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  jogadores: Jogador[]
}