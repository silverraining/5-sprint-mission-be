import { PrismaClient, ResourceType } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma, ResourceType }; // ✅ ResourceType 함께 export
export default prisma;
