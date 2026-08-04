import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { QueryAssetDto } from './dto/query-asset.dto';
import { AssetResponseDto, PaginatedAssetsDto } from './dto/asset-response.dto';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/database/generated/prisma/enums';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  async getAssets(
    @Query() query: QueryAssetDto,
    @CurrentUser('role') role: Role
  ): Promise<PaginatedAssetsDto> {
    return this.assetService.getAssets(query, role);
  }

  @Roles(Role.ADMIN)
  @Post()
  async createAsset(
    @Body() createAssetDto: CreateAssetDto
  ): Promise<AssetResponseDto> {
    return this.assetService.createAsset(createAssetDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateAsset(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssetDto: UpdateAssetDto
  ): Promise<AssetResponseDto> {
    return this.assetService.updateAsset(id, updateAssetDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteAsset(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MessageResponseDto> {
    await this.assetService.deleteAsset(id);
    return { message: 'Asset deleted successfully' };
  }
}
