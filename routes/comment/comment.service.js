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
// 댓글 조회 (id만으로 조회)
const fetchCommentById = async (id) => {
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id,
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
      where: { id: commentId },
      data: { content },
    });
  } catch (err) {
    throw new Error(`Database error while modifying comment :: ${err.message}`);
  }
};

const existComment = async (commentId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  return !!comment; // 댓글이 있으면 true 반환, 없으면 false
};

// 댓글 삭제
const removeComment = async (commentId) => {
  try {
    // 댓글 존재 여부 확인
    if (!(await existComment(commentId))) {
      throw new Error("Invalid comment's id"); // 댓글이 존재하지 않으면 오류 발생
    }

    // 댓글 삭제
    return await prisma.comment.delete({
      where: { id: commentId },
    });
  } catch (err) {
    throw new Error(`Database error while removing comment :: ${err.message}`);
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
