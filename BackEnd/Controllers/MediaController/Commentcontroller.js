import CommentM from '../../Model/Media/Comment.Model.js'

const addComment = async (req, res) => {
    // console.log(req.params)
  try {
    const { text,user_id } = req.body;
    const postId = req.params.id; 

    const newComment = new CommentM({
      text,
      post: postId, 
      user: user_id, 
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Error adding comment to the post.' });
  }
};

const fetchCommentsByPostId = async (req, res, next) => {
    try {
      const postId = req.params.id; 
      const comments = await CommentM.find({ post: postId });
  
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Error fetching comments.' });
    }
  };

export { addComment,fetchCommentsByPostId };
