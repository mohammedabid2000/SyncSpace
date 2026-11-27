import { Test, TestingModule } from '@nestjs/testing';
import { DockerController } from './docker.controller.js';
import { DockerService } from './docker.service.js';

describe('DockerController', () => {
  let controller: DockerController;
  const ping = vi.fn().mockResolvedValue(undefined);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DockerController],
      providers: [{ provide: DockerService, useValue: { ping } }],
    }).compile();

    controller = module.get<DockerController>(DockerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('checks Docker before reporting health', async () => {
    await expect(controller.health()).resolves.toEqual({ docker: 'ok' });
    expect(ping).toHaveBeenCalledOnce();
  });
});
