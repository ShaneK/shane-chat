import { Body, Controller, Get, Param, Post, Res, Sse } from '@nestjs/common';
import { User } from '@shane-chat/models';
import { interval, map, Observable } from 'rxjs';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private _userService: UserService) {}

  @Get('user/search/id/:id')
  public async getUserById(@Param('id') id: string): Promise<User> {
    return await this._userService.getUserDataById(id);
  }

  @Get('user/search/name/:name')
  public async getUserByName(@Param('name') name: string): Promise<User> {
    return await this._userService.getUserDataByName(name);
  }

  @Post('user')
  public async registerUserByName(
    @Body('name') name: string,
    @Res() response
  ): Promise<User | string> {
    const [err, user] = await this._userService.createUserByName(name);
    if (err) {
      return response
        .status(400)
        .send(
          err.indexOf('duplicate key') > -1
            ? 'User already exists.'
            : 'An unknown error occurred. Please try again later.'
        );
    }

    return response.status(201).send(user);
  }

  @Sse('sse')
  public sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => new MessageEvent('message', { data: { hello: 'world' } }))
    );
  }
}
