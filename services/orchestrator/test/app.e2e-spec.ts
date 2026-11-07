import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { NekoService } from './../src/neko/neko.service.js';

describe('AppController (e2e)', () => {
  const serviceToken = 'e2e-service-token';
  const previousToken = process.env.ORCHESTRATOR_API_TOKEN;
  let app: INestApplication<App>;
  let running: Array<{ Id: string; Labels: Record<string, string> }>;
  const startLocal = vi.fn();
  const stopLocal = vi.fn();
  const listLocal = vi.fn();

  beforeEach(async () => {
    process.env.ORCHESTRATOR_API_TOKEN = serviceToken;
    running = [];
    startLocal
      .mockReset()
      .mockImplementation(async (httpPort, udpPort, sessionId) => {
        running.push({
          Id: 'neko-container-id',
          Labels: {
            'com.syncspace.http-port': String(httpPort),
            'com.syncspace.udp-port': String(udpPort),
            'com.syncspace.session-id': String(sessionId),
          },
        });
        return 'neko-container-id';
      });
    stopLocal.mockReset().mockImplementation(async (id) => {
      running = running.filter((container) => container.Id !== id);
    });
    listLocal.mockReset().mockImplementation(async () => [...running]);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(NekoService)
      .useValue({ startLocal, stopLocal, listLocal })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('requires the internal token for session routes', async () => {
    await request(app.getHttpServer()).get('/sessions').expect(401);
    await request(app.getHttpServer())
      .get('/sessions')
      .set('x-orchestrator-token', 'wrong-token')
      .expect(401);
  });

  it('creates, reads, and deletes a session through HTTP', async () => {
    const created = await request(app.getHttpServer())
      .post('/sessions')
      .set('x-orchestrator-token', serviceToken)
      .expect(201);
    const publicSession = {
      id: 1,
      status: 'created',
      containerId: 'neko-container-id',
      httpPort: 8080,
      udpPort: 55000,
    };
    expect(created.body).toMatchObject(publicSession);
    expect(created.body.credentials.ownerPassword).toMatch(/^[0-9a-f]{64}$/);
    expect(created.body.credentials.viewerPassword).toMatch(/^[0-9a-f]{64}$/);
    expect(created.body.credentials.ownerPassword).not.toBe(
      created.body.credentials.viewerPassword,
    );

    await request(app.getHttpServer())
      .get('/sessions/1')
      .set('x-orchestrator-token', serviceToken)
      .expect(200)
      .expect(publicSession);
    await request(app.getHttpServer())
      .get('/sessions')
      .set('x-orchestrator-token', serviceToken)
      .expect(200)
      .expect([publicSession]);
    await request(app.getHttpServer())
      .delete('/sessions/1')
      .set('x-orchestrator-token', serviceToken)
      .expect(204);
    expect(stopLocal).toHaveBeenCalledWith('neko-container-id');
    await request(app.getHttpServer())
      .get('/sessions/1')
      .set('x-orchestrator-token', serviceToken)
      .expect(404);
  });

  it('rejects non-numeric session IDs and has no direct Neko test route', async () => {
    await request(app.getHttpServer())
      .get('/sessions/abc')
      .set('x-orchestrator-token', serviceToken)
      .expect(400);
    await request(app.getHttpServer())
      .delete('/sessions/abc')
      .set('x-orchestrator-token', serviceToken)
      .expect(400);
    await request(app.getHttpServer()).post('/neko/local').expect(404);
  });

  afterEach(async () => {
    await app.close();
    if (previousToken === undefined) {
      delete process.env.ORCHESTRATOR_API_TOKEN;
    } else {
      process.env.ORCHESTRATOR_API_TOKEN = previousToken;
    }
  });
});
