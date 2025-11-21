import { BattleScene } from './components/scenes/BattleScene';
import { DungeonMap } from './components/map/DungeonMap';
import { MainMenu } from './components/scenes/MainMenu';
import { RewardScene } from './components/scenes/RewardScene';
import { RestScene } from './components/scenes/RestScene';
import { EventScene } from './components/scenes/EventScene';
import { ShopScene } from './components/scenes/ShopScene';
import { TopBar } from './components/ui/TopBar';
import { DeckView } from './components/ui/DeckView';
import { VfxLayer } from './components/vfx/VfxLayer';
import { useGameStore } from './store/useGameStore';
import { useVfxStore } from './store/useVfxStore';
import { clsx } from 'clsx';

function App() {
  const currentScene = useGameStore(s => s.currentScene);
  const screenShake = useVfxStore(s => s.screenShake);

  const renderScene = () => {
    switch (currentScene) {
      case 'MENU':
        return <MainMenu />;
      case 'MAP':
        return <DungeonMap />;
      case 'BATTLE':
      case 'BOSS':
        return <BattleScene />;
      case 'REWARD':
        return <RewardScene />;
      case 'REST':
        return <RestScene />;
      case 'EVENT':
        return <EventScene />;
      case 'SHOP':
        return <ShopScene />;
      default:
        return <DungeonMap />;
    }
  };

  return (
    <div className={clsx(
        "w-screen h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden select-none",
        screenShake && "animate-shake" // Define shake animation in global css or tailwind config
    )}>
       {/* Background Layer - Could change based on scene */}
       <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
          {currentScene === 'MAP' ? (
             <img src="/assets/backgrounds/map_bg.svg" className="w-full h-full object-cover" alt="Map Background" />
          ) : (
             <img src="/assets/backgrounds/battle_bg_1.svg" className="w-full h-full object-cover" alt="Battle Background" />
          )}
       </div>

       {/* UI Overlays */}
       <TopBar />
       <DeckView />
       <VfxLayer />
          
       {/* Scene Layer */}
       <div className="relative z-10 w-full h-full pt-12"> {/* Added padding-top for TopBar */}
          {renderScene()}
              </div>
            </div>
  );
}

export default App;
