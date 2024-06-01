import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { SERVER } from '../../config';
import MediaCard from './GalleryCard/GalleryCard';

import './gallery.css';

function Gallery() {
    const [mediaList, setMediaList] = useState([]);

    useEffect(() => {
        axios.get(SERVER + '/media')
          .then((response) => {
            setMediaList(response.data);
          })
          .catch((error) => {
            console.error('Error fetching media data:', error);
          });
      }, []);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('file',file);
        fetch(SERVER + '/media/upload', {
            method: 'POST',
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Upload response:', data);
            })
            .catch((error) => {
              console.error('Upload error:', error);
            });
        setSelectedFile(file);
    };
    return (
        <div>
            <div className="card">
                <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold ">Share a photo/Video</h6>
                </div>
                <div className="card-body">
                    <div>
                        <input type="file" accept="image/*, video/*" onChange={handleFileSelect} />
                    </div>
                </div>
            </div>
            <div className="media-container">
            <div>
      <h2>Media List</h2>
      <div className="media-container">
        {mediaList.map((media, index) => (
          <div key={index} className="media-item">
            {media.type === 'image' ? (
                <MediaCard media={<img src={media.path} alt={media.filename} />} mediaId={media._id}/>
            ) : (
                <MediaCard media={<video controls>
                    <source src={media.path} type={media.mimetype} />
                    Your browser does not support the video tag.
                  </video>} mediaId={media._id}/>
            )}
          </div>
        ))}
      </div>
    </div>
            </div>
        </div>
    );
}

export default Gallery;
