import { Module } from '@nestjs/common';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DesafioSchema } from './interfaces/desafio.schema';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { PartidaSchema } from './interfaces/partida.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Desafio', schema: DesafioSchema }]),
    MongooseModule.forFeature([{ name: 'Partida', schema: PartidaSchema }]),
    CategoriasModule,
    JogadoresModule,
  ],
  controllers: [DesafiosController],
  providers: [DesafiosService]
})
export class DesafiosModule {}
