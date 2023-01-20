import { Test, TestingModule } from '@nestjs/testing';
import { PipesControllerController } from './pipes-controller.controller';

describe('PipesControllerController', () => {
  let controller: PipesControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipesControllerController],
    }).compile();

    controller = module.get<PipesControllerController>(PipesControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
