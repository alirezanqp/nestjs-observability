import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  constructor(private readonly prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    try {
      this.logger.log(createArticleDto);
      return this.prisma.article.create({
        data: {
          title: createArticleDto.title,
          body: createArticleDto.body,
          image: createArticleDto.image ? createArticleDto.image : undefined,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }

  findAll() {
    return this.prisma.article.findMany({});
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: number) {
    return this.prisma.article.delete({ where: { id } });
  }
}
