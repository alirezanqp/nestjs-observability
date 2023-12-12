import { Article } from '@prisma/client';

export class ArticleEntity implements Article {
  id: number;
  title: string;
  image: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}
