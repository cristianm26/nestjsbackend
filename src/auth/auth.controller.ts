import { Controller, Get, ValidationPipe, UsePipes, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { LoginUsuarioDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    getAll() {
        return this.authService.getall();
    }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('nuevo')
    create(@Body() dto: NuevoUsuarioDto) {
        return this.authService.create(dto);
    }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('login')
    login(@Body() dto: LoginUsuarioDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    refresh(@Body() dto: TokenDto) {
        return this.authService.refresh(dto);
    }
}
