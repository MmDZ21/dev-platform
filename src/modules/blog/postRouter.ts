import { generateModule } from '@/lib/cms/generateModule';
import { postMeta } from '@/modules/blog/postMeta';
import { modelPrismaMap } from '@/modules/prismaMap';

export const postRouter = generateModule(postMeta, modelPrismaMap.posts);