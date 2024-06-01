import React, { useState, useEffect } from 'react';
import { SERVER } from '../../../config';
import axios from 'axios';

function MediaCard({ media, mediaId }) {
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState();


  const [comments, setComments] = useState([]);

  async function fetchComments() {
    try {
      const response = await fetch(SERVER + `/comment/${mediaId}`);
      if (!response.ok) {
        throw new Error('Error fetching comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [mediaId]);


  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleComment = (e) => {
    e.preventDefault();

    axios.post(SERVER + `/comment/addComment/${mediaId}`, { text: comment, user_id: '6520cdf4f06f4468c8697a30' })
      .then((response) => {
        console.log('Comment added:', response.data);
        setComment('');
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });

      fetchComments();
  }

  const handleShowComment = () => {
    setShowComment(!showComment);
  }

  return (
    <div className="media-card">
      {media}
      <div className="interaction-buttons">
        <button onClick={handleLike} className={isLiked ? 'liked' : ''}>
          {isLiked ? 'Liked' : 'Like'}
        </button>
        <button onClick={handleShowComment}>Comment</button>
      </div>
      <div className="comment-section row ">
        <input
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={handleCommentChange}
          className='col-8'
        />
        <button className="col-4" onClick={handleComment}>Post</button>
      </div>
      {
        (showComment) ? (
          <div>
              {comments.map((comment, idx) => (
                <div className="media mb-3" key={idx}>
                  <div className="media-body">
                    <h5 className="mt-0">{comment.user.name}</h5>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
          </div>) : ""
      }
    </div>
  );
}

export default MediaCard;
