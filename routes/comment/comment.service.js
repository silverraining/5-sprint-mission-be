import { prisma, ResourceType } from "../../prisma.service.js";

const fetchCommentList = async (cursor, limit, resourceType, resourceId) => {
  console.log("🔍 resourceType before:", resourceType);
  const prismaResourceType = ResourceType[resourceType.toUpperCase()];
  console.log("✅ Converted resourceType:", prismaResourceType);
  const take = parseInt(limit) || 10; // 한 번에 가져올 데이터 개수
  const cursorOptions = cursor
    ? { skip: 1, cursor: { id: cursor } } // 이전 데이터를 건너뜁니다.
    : {};

  return await prisma.comment.findMany({
    ...cursorOptions,
    take,
    where: {
      resourceType: prismaResourceType,
      resourceId,
    },
    orderBy: { createdAt: "asc" },
  });
};

const fetchCommentCount = async (resourceType, resourceId) => {
  return await prisma.comment.count({
    where: {
      resourceType: ResourceType[resourceType.toUpperCase()],
      resourceId,
    },
  });
};

const addComment = async (resourceType, resourceId, content) => {
  try {
    return await prisma.comment.create({
      data: { resourceType, resourceId, content },
    });
  } catch (err) {
    throw new Error(`- Database error while add comment :: ${err.message}`);
  }
};
const modifyComment = async (id, content) => {
  try {
    return await prisma.comment.update({
      data: { content },
      where: {
        id,
      },
    });
  } catch (err) {
    throw new Error(`- Database error while modify comment :: ${err.message}`);
  }
};
const removeComment = async (id) => {
  try {
    return await prisma.comment.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    throw new Error(`- Database error while remove comment :: ${err.message}`);
  }
};

const existComment = async (id) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });
    return !!comment;
  } catch (err) {
    throw new Error(`- Database error while exist comment :: ${err.message}`);
  }
};

const commentervice = {
  fetchCommentList,
  addComment,
  modifyComment,
  removeComment,
  fetchCommentCount,
  existComment,
};

export default commentervice;
