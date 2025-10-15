import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { AtualizarStatusDesafioEnum } from "../enums/atualizar-status-desafio.enum";

export class AtualizarDesafioDto {

  @IsNotEmpty()
  @IsEnum(AtualizarStatusDesafioEnum)
  status: AtualizarStatusDesafioEnum;

  @IsDateString()
  @IsOptional()
  dataHoraDesafio: Date;

}
