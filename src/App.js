import logo from './logo.svg';
import './components/GradientText'
import './index.css'
import ScrollVelocity from './components/ScrollVelocity';
import Dock from './components/Dock';

import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import { SiDiscord, SiGithub, SiYoutube } from 'react-icons/si';


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

</div>
  );
}



export default App;
