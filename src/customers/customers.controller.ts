import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: {
    userId: string,
    email: string,
    businessId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCustomerDto: CreateCustomerDto, @Req() req: AuthRequest) {
    return this.customersService.create(createCustomerDto, req.user.businessId);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.customersService.findAll(req.user.businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.customersService.findOne(id, req.user.businessId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto, @Req() req: AuthRequest) {
    return this.customersService.update(id, updateCustomerDto, req.user.businessId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.customersService.remove(id, req.user.businessId);
  }
}
