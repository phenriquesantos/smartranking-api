import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AtualizarDesafioDto {

  @IsOptional()
  @IsString()
  status?: string;

  @IsDateString()
  @IsOptional()
  dataHoraDesafio?: Date;

}
