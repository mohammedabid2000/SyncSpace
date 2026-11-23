import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('the backend alive');
  });

  it('/health/db (GET)', () => {
    return request(app.getHttpServer())
      .get('/health/db')
      .expect(200)
      .expect({ status: 'ok', database: 'connected' });
  });

  it('/users (POST & GET) - programmatic create and findMany', async () => {
    const uniqueSuffix = Date.now();
    const newUser = {
      username: `test_${uniqueSuffix}`,
      email: `test_${uniqueSuffix}@example.com`,
      passwordHash: 'hashed_password_abc',
      displayName: 'Prisma Test User',
    };

    // Programmatic write (create)
    const postRes = await request(app.getHttpServer())
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(postRes.body).toHaveProperty('id');
    expect(postRes.body.username).toBe(newUser.username);
    expect(postRes.body.email).toBe(newUser.email);

    // Programmatic read (findMany)
    const getRes = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(Array.isArray(getRes.body)).toBe(true);
    const found = getRes.body.find((u: { username: string }) => u.username === newUser.username);
    expect(found).toBeDefined();
    expect(found.id).toBe(postRes.body.id);
  });

  afterEach(async () => {
    await app.close();
  });
});
