import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) { }

  async create(createCustomerDto: CreateCustomerDto, businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    })

    if (!business) {
      throw new Error('Business not found');
    }

    return this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        businessId,
      },
    });
  }

  findAll(businessId: string) {
    return this.prisma.customer.findMany({
      where: { businessId },
    });
  }

  findOne(id: string, businessId: string) {
    return this.prisma.customer.findUnique({
      where: { id, businessId },
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, businessId: string) {
    try {
      return await this.prisma.customer.update({
        where: { id, businessId }, 
        data: updateCustomerDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Customer with ID ${id} not found in this business.`);
      }
      throw error;
    }
  }

  async remove(id: string, businessId: string) {
    try {
      await this.prisma.customer.delete({
        where: { id, businessId }, 
      });
      return { success: true, message: `Customer ${id} removed.` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Customer with ID ${id} not found in this business.`);
      }
      throw error;
    }
  }
}
