import { Controller, Get, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { RolService } from './rol.service';

@Controller('rol')
export class RolController {
    constructor(private readonly rolService: RolService) { }

    @Get()
    getAll() {
        return this.rolService.getall();
    }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    create(@Body() dto: CreateRolDto) {
        return this.rolService.create(dto);
    }
}
