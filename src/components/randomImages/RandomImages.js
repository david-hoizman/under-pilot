import React from 'react';
import './randomImages.css';

const RandomImages = ({ randomImages }) => {
  // console.log(randomImages);

  const imagesToShow = randomImages.slice(0, 4);

  return (
    <div className="random-images">
      {imagesToShow.length === 0 ? (
        <p>אין תמונות להציג כרגע</p>
      ) : (
        imagesToShow.map((imgSrc, index) => (
          <div key={index} className="random-image-card">
            <img className="random-image" src={imgSrc} alt={`random-image-${index}`} />
          </div>
        ))
      )}
    </div>
  );
};

export default RandomImages;
