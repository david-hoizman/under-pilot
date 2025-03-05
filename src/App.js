import React, { useState } from 'react';
import './App.css';
import Gallery from './components/gallery/Gallery';
import RandomImages from './components/randomImages/RandomImages';

const TOTAL_IMAGES = 10000; 
const IMAGE_PATH = '/data/';

const getRandomNumbers = (count, max) => {
  const numbers = new Set();
  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * max) + 1;
    numbers.add(randomNum);
  }
  return Array.from(numbers);
};

function App() {
  const [randomImages, setRandomImages] = useState([]);

  const handleImageClick = () => {
    const selectedNumbers = getRandomNumbers(4, TOTAL_IMAGES); 
    const randomImgs = selectedNumbers.map(num => `${IMAGE_PATH}${num}.jpg`);
    setRandomImages(randomImgs); 
  };

  return (
    <div className="app">
      <div className="left-section">
        <Gallery onImageClick={handleImageClick} /> 
      </div>
      <div className="right-section">
        <RandomImages randomImages={randomImages} /> 
      </div>
    </div>
  );
}

export default App;
