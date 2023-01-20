import { Global, Module } from '@nestjs/common';
import { PremierController } from './premier.controller';

@Global()
@Module({
  controllers: [PremierController]
})
export class PremierModule {}
