import { IsNotEmpty, IsString } from "class-validator";

export class AtualizarJogadorDto {

  @IsString()
  @IsNotEmpty()
  telefoneCelular: string;

  @IsNotEmpty()
  @IsString()
  name: string;

}
