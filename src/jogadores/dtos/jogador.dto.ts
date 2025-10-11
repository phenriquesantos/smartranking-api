import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class JogadorDto {

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
