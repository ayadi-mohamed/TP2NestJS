import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PremierModule } from './premier/premier.module';
import { TodoModule } from './todo/todo.module';
import { CommonModule } from './common/common.module';
import { uuidProvider } from './common/common.uuidProvider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { todoEntity } from './todo/todo.todoEntity';
import { PipesControllerController } from './pipes/pipes-controller/pipes-controller.controller';

@Module({
  imports: [PremierModule, TodoModule, CommonModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nesttp',
      entities: [todoEntity],
      synchronize: true,
    })],
  controllers: [AppController, PipesControllerController],
  providers: [AppService],
})
export class AppModule {}
