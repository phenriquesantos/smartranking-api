import { IsNotEmpty } from "class-validator";
import type { Jogador } from "src/jogadores/interfaces/jogador.interface";
import { Resultado } from "../interfaces/desafio";

export class AdicionarPartidaDesafioDto {

  @IsNotEmpty()
  def: Jogador;

  @IsNotEmpty()
  resultado: Resultado[]
}
