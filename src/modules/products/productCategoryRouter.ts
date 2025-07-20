import { generateModule } from '@/lib/cms/generateModule';
import { modelPrismaMap } from '@/modules/prismaMap';
import { productMeta } from './productMeta';
import { productCategoryMeta } from './productCategoryMeta';

export const productCategoryRouter = generateModule(productCategoryMeta, modelPrismaMap.productsCategories);