import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { PrismaClientKnownRequestError } from '@/database/generated/prisma/internal/prismaNamespace';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  getCategories(): Promise<CategoryResponseDto[]> {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async createCategory(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    try {
      return await this.prisma.category.create({ data: dto });
    } catch (error) {
      throw this.toDuplicateNameError(error);
    }
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    await this.getCategoryOrThrow(id);

    try {
      return await this.prisma.category.update({ where: { id }, data: dto });
    } catch (error) {
      throw this.toDuplicateNameError(error);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    await this.getCategoryOrThrow(id);

    // ลบได้เฉพาะหมวดหมู่ที่ไม่มีอุปกรณ์อ้างอิงอยู่
    const assetCount = await this.prisma.asset.count({
      where: { categoryId: id }
    });
    if (assetCount > 0) {
      throw new ConflictException('This category still has assets using it');
    }

    await this.prisma.category.delete({ where: { id } });
  }

  private async getCategoryOrThrow(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  private toDuplicateNameError(error: unknown): unknown {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return new ConflictException('Category name already exist');
      }
    }
    return error;
  }
}
