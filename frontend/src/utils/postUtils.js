const FALLBACK_AVATAR = '/profile-pic.png';

export const processPost = (post) => {
  const author = post.author;
  const comments = (post.comments || []).map((comment) => ({
    ...comment,
    profileImage: comment.author?.profilePictureUrl || null,
  }));
  return {
    ...post,
    posterName: author ? `${author.firstName} ${author.lastName}` : '',
    posterImage: author?.profilePictureUrl || FALLBACK_AVATAR,
    comments,
  };
};
