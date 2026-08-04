import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/database/generated/prisma/enums';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories(): Promise<CategoryResponseDto[]> {
    return this.categoryService.getCategories();
  }

  @Roles(Role.ADMIN)
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteCategory(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.categoryService.deleteCategory(id);
    return { message: 'Category deleted successfully' };
  }
}
