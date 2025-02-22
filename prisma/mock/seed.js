import { PrismaClient, ResourceType } from "@prisma/client";
const prisma = new PrismaClient();
import { ARTICLE } from "./mock_article.js";
import { COMMENT } from "./mock_comment.js";
import { PRODUCT } from "./mock_product.js";

async function seed() {
  // 기존 데이터 삭제
  await prisma.product.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.comment.deleteMany({});

  // 목 데이터 삽입
  await prisma.article.createMany({
    data: ARTICLE,
    skipDuplicates: true,
  });

  await prisma.product.createMany({
    data: PRODUCT,
    skipDuplicates: true,
  });

  await prisma.comment.createMany({
    data: COMMENT,
    skipDuplicates: true,
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    console.log("success");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
