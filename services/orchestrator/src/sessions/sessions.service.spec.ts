import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service.js';
import { NekoService } from '../neko/neko.service.js';

describe('SessionsService', () => {
  let service: SessionsService;
  const startLocal = vi.fn().mockResolvedValue('neko-container-id');
  const stopLocal = vi.fn().mockResolvedValue(undefined);

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: NekoService, useValue: { startLocal, stopLocal } },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('starts a browser when creating a session and stops it when deleting', async () => {
    const session = await service.create();
    expect(session).toEqual({
      id: 1,
      status: 'created',
      containerId: 'neko-container-id',
    });
    expect(startLocal).toHaveBeenCalledOnce();
    expect(service.get(session.id)).toEqual(session);

    await service.delete(session.id);
    expect(stopLocal).toHaveBeenCalledWith('neko-container-id');
    expect(service.list()).toEqual([]);
  });
});
