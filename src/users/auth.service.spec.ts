import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      findByEmail(email: string) {
        const filteredUsers = users.filter((u) => u.email === email);
        return Promise.resolve(filteredUsers);
      },
      create(email: string, password: string) {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of `AuthService`', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const password = '12345';

    const user = await service.signup('test@test.com', password);
    expect(user.password).not.toBe(password);

    const [salt, hashed] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hashed).toBeDefined();
  });

  it('throws an error if user signs up with an email in use', async () => {
    await service.signup('asdf@asdf.com', '12345');

    try {
      await service.signup('asdf@asdf.com', '12345');

      // To make sure we will get to catch block after the line above ...
      expect(false).toBe(true);
    } catch (err) {
      expect(err.message).toBe('Email in use');
    }
  });

  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signin('asdf@asdf.com', '12345');

      // To make sure we will get to catch block after the line above ...
      expect(false).toBe(true);
    } catch (err) {
      expect(err.message).toBe('User not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('asdf@asdf.com', '12345');

    try {
      await service.signin('asdf@asdf.com', 'sadfasdf');

      // To make sure we will get to catch block after the line above ...
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toBe('Bad password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', '12345');

    const user = await service.signin('asdf@asdf.com', '12345');

    expect(user).toBeDefined();
  });
});
