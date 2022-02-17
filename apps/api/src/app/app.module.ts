import { Module } from '@nestjs/common';
import { RoomController } from './controllers/rooms/room.controller';
import { RoomService } from './controllers/rooms/room.service';
import { UserController } from './controllers/users/user.controller';
import { UserService } from './controllers/users/user.service';
import { DataService, MigrationService } from './shared/services';

@Module({
  imports: [],
  controllers: [UserController, RoomController],
  providers: [UserService, MigrationService, DataService, RoomService],
})
export class AppModule {}
