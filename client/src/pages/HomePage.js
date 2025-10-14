import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

// 1. Import Swiper components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// 2. Import Swiper's core styles and the modules' styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

// Import the images
import bg1 from '../assets/images/bg1.jpg';
import bg2 from '../assets/images/bg2.jpg';
import bg3 from '../assets/images/bg3.jpg';
import bg4 from '../assets/images/bg4.jpg';
import bg5 from '../assets/images/bg5.jpg';
import bg6 from '../assets/images/bg6.jpg';
import bg7 from '../assets/images/bg7.jpg';
import bg8 from '../assets/images/bg8.jpg';
import bg9 from '../assets/images/bg9.jpg';
import bg10 from '../assets/images/bg10.jpg';
import bg11 from '../assets/images/bg11.jpg';
import bg12 from '../assets/images/bg12.jpg';
import bg13 from '../assets/images/bg13.jpg';

const slideImages = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13];

const HomePage = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0">
        {/* 3. Configure the Swiper component */}
        <Swiper
          modules={[Autoplay, EffectFade]} // Tell Swiper which modules to use
          effect="slide" // Set the transition effect
          loop={true} // Loop the slides
          autoplay={{
            delay: 5000, // 5 seconds per slide
            disableOnInteraction: false, // Autoplay continues even after user interaction
          }}
          className="h-full w-full"
          speed={1200}
        >
          {slideImages.map((slideImage, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slideImage})` }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* The centered content overlay (this part remains the same) */}
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