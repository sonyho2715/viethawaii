// Re-export prisma client as db for consistency
import { prisma } from './prisma';

export const db = prisma;
