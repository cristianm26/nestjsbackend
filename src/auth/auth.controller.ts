import { Controller, Get, ValidationPipe, UsePipes, Post, Body, UseGuards, ParseIntPipe, Delete, Put, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { LoginUsuarioDto } from './dto/login.dto';
import { ProductoService } from '../producto/producto.service';
import { RolDecorator } from '../decorators/rol.decorator';
import { RolNombre } from '../rol/rol.enum';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/rol.guard';
import { ProductoDto } from '../producto/dto/producto.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly productoService: ProductoService) { }

    @RolDecorator(RolNombre.ADMIN, RolNombre.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getAll() {
        return await this.productoService.getAll();
    }

    @RolDecorator(RolNombre.ADMIN, RolNombre.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.productoService.findById(id);
    }

    @RolDecorator(RolNombre.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    async create(@Body() dto: ProductoDto) {
        return await this.productoService.create(dto);
    }

    @RolDecorator(RolNombre.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: ProductoDto) {
        return await this.productoService.update(id, dto);
    }

    @RolDecorator(RolNombre.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.productoService.delete(id)
    }
}
