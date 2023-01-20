import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const inputEmail = 'asdfgr@cwasdf.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: inputEmail, password: '12345' })
      .expect(201)

    const { id, email } = res.body;

    expect(id).toBeDefined();
    expect(email).toEqual(inputEmail);
  });

  it('signup as a new user and get currently logged in user', async () => {
    const inputEmail = 'asdf@asdf.com';
    const inputPassword = '12345';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: inputEmail, password: inputPassword })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(inputEmail);
  });
});
