import { Controller, Get } from '@nestjs/common';

@Controller('rooms')
export class RoomsController
{
    @Get()
    GetAllRooms() : string
    {
        return 'the rooms service is alive ';
    }
}
