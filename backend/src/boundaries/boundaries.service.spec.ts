import { Test, TestingModule } from '@nestjs/testing';
import { BoundariesService } from './boundaries.service';

describe('BoundariesService', () => {
  let service: BoundariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoundariesService],
    }).compile();

    service = module.get<BoundariesService>(BoundariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
