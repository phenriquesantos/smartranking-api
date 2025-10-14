import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CriarJogadorDto {

  @IsString()
  @IsNotEmpty()
  readonly telefoneCelular: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly nome: string;
}
