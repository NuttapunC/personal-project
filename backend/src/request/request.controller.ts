import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { QueryRequestDto } from './dto/query-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';
import {
  PaginatedRequestsDto,
  RequestResponseDto
} from './dto/request-response.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/database/generated/prisma/enums';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  async createRequest(
    @CurrentUser('sub') userId: string,
    @Body() createRequestDto: CreateRequestDto
  ): Promise<RequestResponseDto> {
    return this.requestService.createRequest(userId, createRequestDto);
  }

  // คำขอของตัวเอง — ต้องประกาศก่อน :id ไม่งั้น 'me' จะถูกมองเป็น id
  @Get('me')
  async getMyRequests(
    @CurrentUser('sub') userId: string,
    @Query() query: QueryRequestDto
  ): Promise<PaginatedRequestsDto> {
    return this.requestService.getRequests(query, userId);
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAllRequests(
    @Query() query: QueryRequestDto
  ): Promise<PaginatedRequestsDto> {
    return this.requestService.getRequests(query);
  }

  @Get(':id')
  async getRequestById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: Role
  ): Promise<RequestResponseDto> {
    return this.requestService.getRequestById(id, userId, role);
  }

  @Patch(':id/cancel')
  async cancelRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') userId: string
  ): Promise<RequestResponseDto> {
    return this.requestService.cancelRequest(id, userId);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/approve')
  async approveRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') adminId: string
  ): Promise<RequestResponseDto> {
    return this.requestService.approveRequest(id, adminId);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/reject')
  async rejectRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') adminId: string,
    @Body() rejectRequestDto: RejectRequestDto
  ): Promise<RequestResponseDto> {
    return this.requestService.rejectRequest(id, adminId, rejectRequestDto);
  }
}
