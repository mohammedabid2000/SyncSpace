import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller.js';
import { SessionsService } from './sessions.service.js';

describe('SessionsController', () => {
  let controller: SessionsController;
  const session = {
    id: 1,
    status: 'created',
    containerId: 'neko-container-id',
  };
  const create = vi.fn().mockResolvedValue(session);
  const list = vi.fn().mockResolvedValue([session]);
  const get = vi.fn().mockResolvedValue(session);
  const remove = vi.fn().mockResolvedValue(undefined);

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        {
          provide: SessionsService,
          useValue: { create, list, get, delete: remove },
        },
      ],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it('delegates session requests to the service', async () => {
    await expect(controller.create()).resolves.toEqual(session);
    await expect(controller.list()).resolves.toEqual([session]);
    await expect(controller.get(session.id)).resolves.toEqual(session);
    await controller.delete(session.id);
    expect(remove).toHaveBeenCalledWith(session.id);
  });
});
