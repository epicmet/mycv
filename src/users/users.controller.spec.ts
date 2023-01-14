import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne(id) {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      findByEmail(email) {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      // remove(id) {},
      // update(id, attrs) {},
    };
    fakeAuthService = {
      signin() {
        return Promise.resolve({
          id: 1,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      // signup(email, password) {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');
    expect(users.length).toBe(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns the user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.email).toEqual('asdf@asdf.com');
  });

  it('findUser throws an error if id is not found', async () => {
    fakeUsersService.findOne = () => null;

    try {
      await controller.findUser('1');

      // To make sure we will get to catch block after the line above ...
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toBe('User not found');
    }
  });

  it('signin update session object and returns user', async () => {
    const session = {
      userId: -1,
    };

    const user = await controller.signin(
      { email: 'asdf@asdf.com', password: 'asdf' },
      session,
    );

    expect(user.id).toBe(1);
    expect(session.userId).toBe(1);
  });
});
