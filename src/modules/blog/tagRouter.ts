import { generateModule } from '@/lib/cms/generateModule';
import { postMeta } from '@/modules/blog/postMeta';
import { modelPrismaMap } from '@/modules/prismaMap';
import { tagMeta } from '@/modules/blog/tagMeta';

export const tagRouter = generateModule(tagMeta, modelPrismaMap.tags);