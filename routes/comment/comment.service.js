import { prisma, ResourceType } from "../../prisma.service.js";

const fetchCommentList = async (cursor, limit, resourceType, resourceId) => {
  console.log("🔍 resourceType :", resourceType);
  const prismaResourceType = resourceType;

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
const fetchCommentById = async (id, resourceType, resourceId) => {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id,
        resourceType,
        resourceId,
      },
    });
    if (!comment) {
      throw new Error("Comment not found.");
    }
    return comment;
  } catch (err) {
    throw new Error(`Database error while fetching comment :: ${err.message}`);
  }
};

const addComment = async (resourceType, resourceId, content) => {
  console.log("📝 Prisma 저장 직전 데이터:", {
    resourceType,
    resourceId,
    content,
  });
  try {
    return await prisma.comment.create({
      data: { resourceType, resourceId, content },
    });
  } catch (err) {
    throw new Error(`- Database error while add comment :: ${err.message}`);
  }
};

const modifyComment = async (commentId, content) => {
  try {
    return await prisma.comment.update({
      where: { id: commentId }, // ID로만 찾고 수정
      data: { content },
    });
  } catch (err) {
    throw new Error(`Database error while modifying comment :: ${err.message}`);
  }
};

const existComment = async (commentId, resourceType, resourceId) => {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        resourceType,
        resourceId,
      },
    });
    return !!comment;
  } catch (err) {
    throw new Error(
      `Database error while checking if comment exists :: ${err.message}`
    );
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

const commentervice = {
  fetchCommentList,
  fetchCommentById,
  addComment,
  modifyComment,
  removeComment,
  fetchCommentCount,
  existComment,
};

export default commentervice;
