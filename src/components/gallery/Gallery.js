import React, { useState, useEffect } from 'react';
import './gallery.css'; 
import RandomImages from '../randomImages/RandomImages';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; 

const TOTAL_IMAGES = 10000; 
const IMAGES_PER_PAGE = 35; 
const IMAGE_PATH = '/data/'; 

const getRandomNumbers = (count, max) => {
  const numbers = new Set();
  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * max) + 1;
    numbers.add(randomNum);
  }
  return Array.from(numbers);
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [likes, setLikes] = useState({});
  const [randomImages, setRandomImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const MAX_SELECTED_IMAGES = 10;

  const loadImages = async () => {
    setLoading(true);
    const selectedNumbers = getRandomNumbers(IMAGES_PER_PAGE, TOTAL_IMAGES);
    const validImages = [];

    for (const num of selectedNumbers) {
      const imgSrc = `${IMAGE_PATH}${num}.jpg`;
      const isValid = await checkImageExists(imgSrc);
      if (isValid) {
        validImages.push({ id: num, src: imgSrc });
      }
    }

    while (validImages.length < IMAGES_PER_PAGE) {
      const extraNum = Math.floor(Math.random() * TOTAL_IMAGES) + 1;
      const extraImgSrc = `${IMAGE_PATH}${extraNum}.jpg`;
      if (!validImages.find(img => img.src === extraImgSrc) && (await checkImageExists(extraImgSrc))) {
        validImages.push({ id: extraNum, src: extraImgSrc });
      }
    }

    setImages(validImages);
    setLoading(false);
  };

  const checkImageExists = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };
  // פונקציה להוציא את שם הקובץ בלי סיומת
  const getFileNameWithoutExtension = (filePath) => {
    return filePath.split('/').pop().replace(/\.[^/.]+$/, '');
  };


  const getLikesAndDislikes = (likes) => {
    const likedImages = Object.keys(likes).filter(id => likes[id] === 'like');
    const dislikedImages = Object.keys(likes).filter(id => likes[id] === 'dislike');
    // console.log("likedImages:",likedImages, "dislikedImages:", dislikedImages);
    setRandomImages(['/data/5813.jpg', "/data/329.jpg", "/data/7533.jpg", "/data/7633.jpg"]);
    
  
    
  };
  
  // useEffect(() => {
  //   const updatedLikes = getLikesAndDislikes(likes);
  // }, [likes]);
  


  const handleLike = (id) => {
    handleImageSelection(id, 'like');
  };

  const handleDislike = (id) => {
    handleImageSelection(id, 'dislike');
  };

  const handleImageSelection = (id, buttonType) => {
    const image = images.find(img => img.id === id);
    if (!image) return;

    const imageExists = selectedImages.some(img => img.id === id);
    if (imageExists) {
      if (likes[id] === buttonType) return;

      setSelectedImages(prevSelected => prevSelected.filter(img => img.id !== id));
    }

    setSelectedImages(prevSelected => {
      const newSelected = [...prevSelected, image];

      if (newSelected.length > MAX_SELECTED_IMAGES) {
        newSelected.shift();
      }
      return newSelected;
    });

    setLikes(prev => ({ ...prev, [id]: buttonType }));
    // הוצאת שם התמונה בלי סיומת ושליחתו לפונקציה
    const fileName = getFileNameWithoutExtension(image.src);
    getLikesAndDislikes(likes);
    

    // loadRandomImages();
  };

  // const loadRandomImages = async () => {
    // let randomImgs = [];
    // while (randomImgs.length < 4) {
    //   const selectedNumbers = getRandomNumbers(4, TOTAL_IMAGES);
    //   for (let num of selectedNumbers) {
    //     const imgSrc = `${IMAGE_PATH}${num}.jpg`;
    //     const isValid = await checkImageExists(imgSrc);
    //     if (isValid && !randomImgs.includes(imgSrc)) {
    //       randomImgs.push(imgSrc);
    //       console.log(imgSrc);
          
    //     }
    //   }
    // }

    // setRandomImages(['/data/5813.jpg', "/data/329.jpg", "/data/7533.jpg", "/data/7633.jpg"]);
  // };

  const handleRefresh = () => {
    loadImages();    
  };

  const handleClearSelectedImages = () => {
    setSelectedImages([]); 
    setLikes({});
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div>
      <div className="header">
        <button onClick={handleRefresh} disabled={loading}>Refresh Images</button>
        <button onClick={handleClearSelectedImages}>Clear selected images</button> 
      </div>
      <div className="gall">
        <div className="gallery-container">
          {images.map((image) => (
            <div className="image-card" key={image.id}>
              <img className="image" src={image.src} />
              <div className="button-container">
                <button
                  className={`button ${likes[image.id] === 'like' ? 'liked' : ''}`}
                  onClick={() => handleLike(image.id)}
                >
                  Like
                </button>
                <button
                  className={`button ${likes[image.id] === 'dislike' ? 'disliked' : ''}`}
                  onClick={() => handleDislike(image.id)}
                >
                  Dislike
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="random-images-container">
          <RandomImages randomImages={randomImages} />
        </div>
      </div>

      <div className="selected-images-container">
        <h3 className='selected-heder'>Selected Images</h3>
        <div className="selected-images">
          {selectedImages.map((image) => (
            <div key={image.id} className="selected-image-card">
              <img className="selected-image" src={image.src} alt={`selected-image-${image.id}`} />
              <div className={`selected-image-border ${likes[image.id] === 'like' ? 'liked-border' : 'disliked-border'}`} />
              <div className="selected-image-icon">
                {likes[image.id] === 'like' ? (
                  <FaThumbsUp color="green" />
                ) : (
                  <FaThumbsDown color="red" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
