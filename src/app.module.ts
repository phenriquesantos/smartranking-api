import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI || '',
      {  }
    ), 
    JogadoresModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
