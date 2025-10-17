import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { DesafioStatus } from "../enums/desafio-status.enum";

export class DesafioStatusValidacaoPipe implements PipeTransform {

  private readonly statusValidos = [
    DesafioStatus.ACEITO,
    DesafioStatus.NEGADO,
    DesafioStatus.CANCELADO,
  ];

  transform(value: any, metadata: ArgumentMetadata) {
    const status = value.status;
    if(!this.statusValido(status)){
      throw new BadRequestException(`O valor ${status} paro o campo status é invalido. ` +
        `Os valores aceitos para este campo são: '${this.statusValidos.join('\', \'')}'`);
    }

    return value;
  }

  private statusValido(status: any){
    return this.statusValidos.includes(status);
  }

}