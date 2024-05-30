import { Test, TestingModule } from '@nestjs/testing';
import { BoundariesController } from './boundaries.controller';
import { BoundariesService } from './boundaries.service';

describe('BoundariesController', () => {
  let controller: BoundariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoundariesController],
      providers: [BoundariesService],
    }).compile();

    controller = module.get<BoundariesController>(BoundariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
