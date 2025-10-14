import React from 'react';
import { Link } from 'react-router-dom';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import Button from '../components/Button';

import bg1 from '../assets/images/bg1.jpg';
import bg2 from '../assets/images/bg2.jpg';
import bg3 from '../assets/images/bg3.jpg';
import bg4 from '../assets/images/bg4.jpg';
import bg5 from '../assets/images/bg5.jpg';

const slideImages = [bg1, bg2, bg3, bg4, bg5];

const HomePage = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden"> {/* Use full screen height and width */}
      <div className="absolute inset-0"> {/* New wrapper for the slider */}
        <Slide duration={5000} transitionDuration={1000} indicators={false} arrows={false} pauseOnHover={false}>
          {slideImages.map((slideImage, index) => (
            <div key={index} className="h-screen w-screen bg-cover bg-center"
                 style={{ 'backgroundImage': `url(${slideImage})` }}>
            </div>
          ))}
        </Slide>
      </div>

      {/* The centered content overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-50 text-white z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-down">
          Welcome to GameNightHub
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in-up">
          Your central hub for finding teammates and organizing game nights.
          Stop playing solo and find your perfect squad today.
        </p>
        <Link to="/lobbies">
          <Button>Browse Lobbies</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;