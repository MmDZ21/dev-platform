import { generateModule } from '@/lib/cms/generateModule';
import { prisma } from '@/lib/db';
import { productCategoryMeta } from './productCategoryMeta';

export const productCategoryRouter = generateModule(productCategoryMeta, prisma.productCategory);