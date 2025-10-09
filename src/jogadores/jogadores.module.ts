import { Logger, Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';

@Module({
  controllers: [JogadoresController],
  providers: [JogadoresService, Logger]
})
export class JogadoresModule {}
