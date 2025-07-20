import { generateModule } from '@/lib/cms/generateModule';
import { modelPrismaMap } from '@/modules/prismaMap';
import { productMeta } from './productMeta';

export const productRouter = generateModule(productMeta, modelPrismaMap.products);