import { generateModule } from '@/lib/cms/generateModule';
import { modelPrismaMap } from '@/modules/prismaMap';
import { categoryMeta } from './categoryMeta';

export const categoryRouter = generateModule(categoryMeta, modelPrismaMap.categories);