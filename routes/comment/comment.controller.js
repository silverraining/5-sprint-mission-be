import commentService from "./comment.service.js";
import productService from "../product/product.service.js";
import articleService from "../article/article.service.js";

const fetchCommentList = async (req, res) => {
  const { resourceType, resourceId } = extractResource(req);
  console.log("🔍 resourceType:", resourceType, "resourceId:", resourceId);
  const { cursor, limit = 10 } = req.query;

  if (!(await validateResource(resourceType, resourceId))) {
    console.log(`[ERROR] Invalid Resource ID: ${resourceType}, ${resourceId}`);
    return res
      .status(400)
      .send({ message: "The specified Resource ID does not exist." });
  }

  try {
    console.log(
      `[DEBUG] Fetching comments - resourceType: ${resourceType}, resourceId: ${resourceId}, cursor: ${cursor}, limit: ${limit}`
    );

    const commentList = await commentService.fetchCommentList(
      cursor,
      limit,
      resourceType,
      resourceId
    );
    const totalCount = await commentService.fetchCommentCount(
      resourceType,
      resourceId
    );

    console.log(`[DEBUG] Retrieved comments count: ${totalCount}`);

    res.status(200).send({ list: commentList, totalCount });
  } catch (err) {
    console.error(
      `Error API in GET '/comments' | message::${err.message}`,
      err.stack
    );
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// const addComment = async (req, res) => {
//   const { resourceType, resourceId } = extractResource(req);
//   const { content } = req.body;

//   if (!content || typeof content !== "string")
//     return res
//       .status(400)
//       .send({ message: "Content is required and must be a string." });
//   if (!(await validateResource(resourceType, resourceId)))
//     return res
//       .status(400)
//       .send({ message: "The specified Resource ID does not exist." });

//   try {
//     const comment = await commentService.addComment(
//       resourceType,
//       resourceId,
//       content
//     );
//     res.status(201).send(comment);
//   } catch (err) {
//     console.log(`Error API in POST '/comments' | message::${err.message}`);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// };

const addComment = async (req, res) => {
  console.log("📩 [POST] /comments 요청 받음");
  console.log("🔹 요청 데이터:", req.body);

  const { resourceType, resourceId } = extractResource(req);
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    console.log("🚨 오류: content가 올바르지 않음!");
    return res
      .status(400)
      .send({ message: "Content is required and must be a string." });
  }

  if (!(await validateResource(resourceType, resourceId))) {
    console.log(`🚨 오류: 유효하지 않은 resourceId (${resourceId})`);
    return res
      .status(400)
      .send({ message: "The specified Resource ID does not exist." });
  }

  try {
    console.log("✅ 댓글 저장 중...");
    const comment = await commentService.addComment(
      resourceType,
      resourceId,
      content
    );
    console.log("🎉 저장 완료:", comment);
    res.status(201).send(comment);
  } catch (err) {
    console.log(`❌ Error API in POST '/comments' | message: ${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const fetchCommentById = async (req, res) => {
  const { resourceType, resourceId, commentId } = req.params;

  try {
    // 댓글 조회
    const comment = await commentService.fetchCommentById(
      commentId,
      resourceType,
      resourceId
    );

    // 댓글이 없으면 404 반환
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    // 댓글이 존재하면 해당 댓글을 반환
    res.status(200).json(comment);
  } catch (err) {
    console.error(
      `Error in GET '/${resourceType}/${resourceId}/comments/${commentId}' | message::${err.message}`
    );
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const modifyComment = async (req, res) => {
  const { resourceType, resourceId, commentId } = req.params;
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    return res
      .status(400)
      .send({ message: "Content is required and must be a string." });
  }

  try {
    // 수정할 데이터 로그 확인
    console.log("Received data for comment modification:", {
      commentId,
      content,
    });

    // 댓글 수정
    const updatedComment = await commentService.modifyComment(
      commentId,
      content
    );

    // 수정된 댓글 응답
    res.status(200).send(updatedComment);
  } catch (err) {
    console.error(
      `Error in PATCH '/${resourceType}s/${resourceId}/comments/${commentId}' | message::${err.message}`
    );
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const removeComment = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await commentService.existComment(id)))
      return res.status(400).send({ message: "Invalid comment's id" });
    await commentService.removeComment(id);
    res.sendStatus(204);
  } catch (err) {
    console.log(
      `Error API in DELETE '/comments/${id}' | message::${err.message}`
    );
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const extractResource = (req) => {
  const path = req.baseUrl; // 예: "/api/products" 또는 "/api/articles"
  let resourceType;
  let resourceId;

  if (path.includes("/products")) {
    resourceType = "PRODUCT";
    resourceId = req.params.id;
  } else if (path.includes("/articles")) {
    resourceType = "ARTICLE";
    resourceId = req.params.id;
  } else {
    throw new Error("Invalid resource type");
  }

  return { resourceType, resourceId };
};

const validateResource = async (resourceType, resourceId) => {
  let exist = false;

  try {
    if (resourceType === "PRODUCT")
      exist = await productService.existProduct(resourceId);
    if (resourceType === "ARTICLE")
      exist = await articleService.existArticle(resourceId);
  } catch (err) {
    throw new Error("product, article 확인할 때 에러");
  } finally {
    return exist;
  }
};

const commentController = {
  fetchCommentList,
  fetchCommentById,
  addComment,
  modifyComment,
  removeComment,
};

export default commentController;
