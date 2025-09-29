import './components/GradientText'
import './index.css'
import ScrollVelocity from './components/ScrollVelocity';
import Dock from './components/Dock';
import TiltedCard from './components/TiltedCard';

import pfp_tasque_manager from "./pfp/tasque-deltarune.gif"
import pfp_cat from './pfp/cat.jpg'
import pfp_silly_little_fox from './pfp/silly_little_fox.jpg'

import { SiDiscord, SiGithub, SiYoutube } from 'react-icons/si';
import GradientText from './components/GradientText';


const items = [
  { icon: <SiDiscord size={18} color="#ffffff" />, label: 'Unmapped Nest Discord :3', onClick: () => window.open('https://discord.gg/hPg9S2F2nD', '_blank', 'noopener,noreferrer') },
  { icon: <SiGithub size={18} color="#ffffff" />, label: 'My Github with cool projects', onClick: () => window.open('https://github.com/NotNekodev', '_blank', 'noopener,noreferrer') },
  { icon: <SiYoutube size={18} color="#ffffff"/>, label: '100% real Youtube', onClick: () => window.open('https://www.youtube.com/@notnekodev', '_blank', 'noopener,noreferrer') },
];

function App() {
  return (
<div>
<ScrollVelocity
  texts={['NotNekodev', 'NotCatdev']} 
  velocity={100} 
  className="title-scroll-text"
/>

<p className='text'><b>hi :3 I'm Nekodev, and ADHD fueled programmer, that likes cameras, Formula 1, and the German Red Cross</b></p>

<Dock 
items={items}
panelHeight={70}
baseItemSize={60}
magnification={70}
/>

<GradientText>
  <h1 className='title'>Profile Picture Gallery</h1>
</GradientText>
<p className='text'><b>collection of some profile picture i like :P feel free to download them i wont sue u</b></p>

<div className="card-container">
      <TiltedCard
        imageSrc={pfp_tasque_manager}
        altText="Tasque Manager Profile Picture"
        captionText="Tasque Manager PFP"
        containerHeight="300px"
        containerWidth="300px"
        imageHeight="300px"
        imageWidth="300px"
        rotateAmplitude={12}
        scaleOnHover={1.2}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={
          <p className="pfp-gallary-overlay">
            Tasque Manager PFP
          </p>
        }
      />

      <TiltedCard
        imageSrc={pfp_cat}
        altText="Cat Profile Picture"
        captionText="Cat PFP"
        containerHeight="300px"
        containerWidth="300px"
        imageHeight="300px"
        imageWidth="300px"
        rotateAmplitude={12}
        scaleOnHover={1.2}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={
          <p className="pfp-gallary-overlay">
            Cat PFP
          </p>
        }
      />

      <TiltedCard
        imageSrc={pfp_silly_little_fox}
        altText="Silly fox PFP"
        captionText="Silly fox PFP"
        containerHeight="300px"
        containerWidth="300px"
        imageHeight="300px"
        imageWidth="300px"
        rotateAmplitude={12}
        scaleOnHover={1.2}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={
          <p className="pfp-gallary-overlay">
            Very Silly Fox :3
          </p>
        }
      />
    </div>
  
<div style={{ height: "100vh"}}></div>

</div>
  );
}



export default App;
