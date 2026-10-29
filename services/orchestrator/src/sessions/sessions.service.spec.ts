import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service.js';
import { NekoService } from '../neko/neko.service.js';

describe('SessionsService', () => {
  let service: SessionsService;
  const startLocal = vi.fn().mockResolvedValue('neko-container-id');
  const stopLocal = vi.fn().mockResolvedValue(undefined);
  const listLocal = vi.fn().mockResolvedValue([]);

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: NekoService,
          useValue: { startLocal, stopLocal, listLocal },
        },
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
      httpPort: 8080,
      udpPort: 55000,
    });
    expect(startLocal).toHaveBeenCalledWith(8080, 55000, 1);
    expect(service.get(session.id)).toEqual(session);

    await service.delete(session.id);
    expect(stopLocal).toHaveBeenCalledWith('neko-container-id');
    expect(service.list()).toEqual([]);
  });

  it('gives concurrent sessions separate ports and reuses a released slot', async () => {
    const first = await service.create();
    const second = await service.create();
    expect(second).toMatchObject({ id: 2, httpPort: 8081, udpPort: 55001 });
    expect(startLocal).toHaveBeenNthCalledWith(2, 8081, 55001, 2);

    await service.delete(first.id);
    const third = await service.create();
    expect(third).toMatchObject({ id: 3, httpPort: 8080, udpPort: 55000 });
  });

  it('releases a reserved port when starting Neko fails', async () => {
    startLocal.mockRejectedValueOnce(new Error('Docker start failed'));
    await expect(service.create()).rejects.toThrow('Docker start failed');

    const session = await service.create();
    expect(session).toMatchObject({ id: 2, httpPort: 8080, udpPort: 55000 });
  });

  it('restores labeled containers and reserves their ports on startup', async () => {
    listLocal.mockResolvedValueOnce([
      {
        Id: 'existing-container',
        Labels: {
          'com.syncspace.http-port': '8080',
          'com.syncspace.udp-port': '55000',
          'com.syncspace.session-id': '7',
        },
      },
    ]);

    await service.onModuleInit();
    expect(service.get(7)).toMatchObject({
      containerId: 'existing-container',
      httpPort: 8080,
      udpPort: 55000,
    });

    const next = await service.create();
    expect(next).toMatchObject({ id: 8, httpPort: 8081, udpPort: 55001 });
  });
});
