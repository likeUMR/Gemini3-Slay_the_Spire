import { create } from 'zustand';
import { PlayableCard, CardTarget, Card, DeckCard } from '../core/cards/types';
import { Player, Enemy, IntentType } from '../core/entities/types';
import { CARDS } from '../data/cards';
import { ENEMIES } from '../data/enemies';
import { RELICS } from '../data/relics';
import { EVENTS } from '../data/events';
import { Relic } from '../core/relics/types';
import { GameEvent, EventOption, EventEffect } from '../core/events/types';
import { GameMap, MapNode, NodeStatus, NodeType } from '../core/map/NodeTypes';
import { generateMap } from '../core/map/MapGenerator';
import { getNextIntent } from '../core/entities/enemyAI';
import { soundManager } from '../utils/audio';
import { useVfxStore } from './useVfxStore';

type GameScene = 'MENU' | 'MAP' | 'BATTLE' | 'EVENT' | 'REWARD' | 'SHOP' | 'REST';

interface GameState {
  player: Player;
  
  // Map State
  map: GameMap;
  currentMapNode: MapNode | null;
  currentScene: GameScene;
  
  // UI State
  isDeckOpen: boolean;

  // Battle State
  enemies: Enemy[];
  hand: PlayableCard[];
  drawPile: PlayableCard[];
  discardPile: PlayableCard[];
  currentTurn: number;
  gameStatus: 'PLAYER_TURN' | 'ENEMY_TURN' | 'WON' | 'LOST';
  rewardCards: Card[];
  
  // Shop State
  shopCards: Card[];
  shopRelics: string[]; // Relic IDs
  purgeCost: number;

  // Event State
  currentEvent: GameEvent | null;
  
  // Actions
  startGame: () => void;
  visitNode: (nodeId: string) => void;
  completeBattle: () => void;
  chooseReward: (card: Card) => void;
  skipReward: () => void;
  
  // UI Actions
  toggleDeck: (isOpen: boolean) => void;
  
  // Rest/Event/Shop Actions
  restHeal: () => void;
  upgradeCard: (uniqueId: string) => void; 
  addRelic: (relicId: string) => void; 
  buyCard: (card: Card) => void;
  removeCard: (uniqueId: string) => void; // For Shop/Event
  resolveEventOption: (option: EventOption) => void;
  
  // Battle Actions
  initializeBattle: (nodeType: NodeType) => void;
  drawCards: (amount: number) => void;
  playCard: (card: PlayableCard, targetId?: string) => void;
  endTurn: () => void;
}

const INITIAL_DECK_IDS = ['strike', 'strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'bash'];

const createPlayer = (): Player => ({
  hp: 80,
  maxHp: 80,
  block: 0,
  energy: 3,
  maxEnergy: 3,
  gold: 99,
  statusEffects: [],
  deck: INITIAL_DECK_IDS.map(id => ({ id, uniqueId: Math.random().toString(36).substring(7), upgraded: false })),
  relics: [{ ...RELICS['burning_blood'] }] 
});

const createEnemy = (id: string, templateId: string): Enemy => {
  const template = ENEMIES[templateId];
  const tempEnemy: any = { ...template, id, hp: template.maxHp, templateId };
  const intent = getNextIntent(tempEnemy, 1);
  
  return {
    ...template,
    id,
    templateId,
    hp: template.maxHp, 
    intent: intent
  };
};

export const useGameStore = create<GameState>((set, get) => ({
  player: createPlayer(),
  
  map: [],
  currentMapNode: null,
  currentScene: 'MENU',
  isDeckOpen: false,

  enemies: [],
  hand: [],
  drawPile: [],
  discardPile: [],
  currentTurn: 0,
  gameStatus: 'PLAYER_TURN',
  rewardCards: [],

  shopCards: [],
  shopRelics: [],
  purgeCost: 75,
  currentEvent: null,

  startGame: () => {
      const newMap = generateMap();
      set({
          player: createPlayer(), // Reset player
          map: newMap,
          currentMapNode: null,
          currentScene: 'MAP',
          rewardCards: [],
          isDeckOpen: false,
          purgeCost: 75
      });
  },

  toggleDeck: (isOpen: boolean) => set({ isDeckOpen: isOpen }),

  visitNode: (nodeId: string) => {
      const { map, currentMapNode } = get();
      
      let targetNode: MapNode | undefined;
      for (const layer of map) {
          const found = layer.find(n => n.id === nodeId);
          if (found) {
              targetNode = found;
              break;
          }
      }

      if (!targetNode) return;
      if (targetNode.status !== NodeStatus.AVAILABLE) return;

      const newMap = map.map(layer => layer.map(node => {
          if (currentMapNode && node.id === currentMapNode.id) {
              return { ...node, status: NodeStatus.COMPLETED };
          }
          if (node.id === nodeId) {
              return { ...node, status: NodeStatus.CURRENT };
          }
          return node;
      }));

      set({
          map: newMap,
          currentMapNode: { ...targetNode, status: NodeStatus.CURRENT }
      });

      switch (targetNode.type) {
          case NodeType.MONSTER:
          case NodeType.ELITE:
          case NodeType.BOSS:
              get().initializeBattle(targetNode.type);
              break;
          case NodeType.REST:
              set({ currentScene: 'REST' });
              break;
          case NodeType.EVENT:
              // Random Event Logic
              const eventKeys = Object.keys(EVENTS);
              const randomEvent = EVENTS[eventKeys[Math.floor(Math.random() * eventKeys.length)]];
              set({ currentScene: 'EVENT', currentEvent: randomEvent }); 
              break;
          case NodeType.SHOP:
              // Generate Shop Inventory
              const allCards = Object.values(CARDS);
              const shopCards: Card[] = [];
              for(let i=0; i<5; i++) shopCards.push(allCards[Math.floor(Math.random() * allCards.length)]);
              
              set({ 
                  currentScene: 'SHOP', 
                  shopCards,
                  shopRelics: ['bag_of_marbles', 'vajra', 'anchor'] // Simplified
              }); 
              break;
          default:
              console.log(`Visited ${targetNode.type}, auto-completing.`);
              get().completeBattle(); 
              break;
      }
  },

  // ... (restHeal, upgradeCard same as before) ...
  restHeal: () => {
      const { player, map, currentMapNode } = get();
      if (!currentMapNode) return;
      const healAmount = Math.floor(player.maxHp * 0.3);
      const newHp = Math.min(player.maxHp, player.hp + healAmount);
      set({ player: { ...player, hp: newHp } });
      get().skipReward(); // Reuse navigation logic
  },

  upgradeCard: (uniqueId: string) => {
      const { player } = get();
      const newDeck = player.deck.map(c => c.uniqueId === uniqueId ? { ...c, upgraded: true } : c);
      set({ player: { ...player, deck: newDeck } });
      get().skipReward();
  },

  // ...

  addRelic: (relicId: string) => {
      const { player } = get();
      const relic = RELICS[relicId];
      if (!relic) return;

      if (get().currentScene === 'SHOP') {
          if (player.gold >= relic.price) {
              const newPlayer = { ...player, gold: player.gold - relic.price, relics: [...player.relics, relic] };
              // Remove from shop list
              const newShopRelics = get().shopRelics.filter(id => id !== relicId);
              set({ player: newPlayer, shopRelics: newShopRelics });
          }
      } else {
          // Free relic (Event)
          set({ player: { ...player, relics: [...player.relics, relic] } });
      }
  },

  buyCard: (card: Card) => {
      const { player, shopCards } = get();
      const price = Math.floor(card.cost * 50 + 50); // Simple price logic: 50-150g
      
      if (player.gold >= price) {
          const newCard: DeckCard = {
              id: card.id,
              uniqueId: Math.random().toString(36).substring(7),
              upgraded: false
          };
          const newPlayer = { ...player, gold: player.gold - price, deck: [...player.deck, newCard] };
          const newShopCards = shopCards.filter(c => c.id !== card.id); // Remove ONE instance of this card? Or by index? Filter removes all with same ID.
                                                                        // Better to match by index if duplicates allowed, but for now ID is fine.
          set({ player: newPlayer, shopCards: newShopCards });
      }
  },

  removeCard: (uniqueId: string) => {
      const { player, purgeCost, currentScene } = get();
      
      if (currentScene === 'SHOP') {
          if (player.gold >= purgeCost) {
              const newDeck = player.deck.filter(c => c.uniqueId !== uniqueId);
              set({ 
                  player: { ...player, gold: player.gold - purgeCost, deck: newDeck },
                  purgeCost: purgeCost + 25
              });
          }
      } else {
          // Event (Free removal usually)
          const newDeck = player.deck.filter(c => c.uniqueId !== uniqueId);
          set({ player: { ...player, deck: newDeck } });
      }
  },

  resolveEventOption: (option: EventOption) => {
      const { player } = get();
      let newPlayer = { ...player };
      let shouldLeave = false;

      option.effects.forEach(effect => {
          switch (effect.type) {
              case 'GAIN_GOLD': newPlayer.gold += (effect.value || 0); break;
              case 'LOSE_GOLD': newPlayer.gold = Math.max(0, newPlayer.gold - (effect.value || 0)); break;
              case 'GAIN_HP': newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + (effect.value || 0)); break;
              case 'LOSE_HP': newPlayer.hp = Math.max(1, newPlayer.hp - (effect.value || 0)); break; // Don't die in event? StS allows it.
              case 'GAIN_MAX_HP': newPlayer.maxHp += (effect.value || 0); newPlayer.hp += (effect.value || 0); break;
              case 'LEAVE': shouldLeave = true; break;
              case 'REMOVE_CARD':
                  // Trigger Deck View with "Remove Mode" - Complex.
                  // For MVP, remove random card or basic strike
                  // Let's just remove a random Strike for now to keep flow simple, or skip.
                  const strike = newPlayer.deck.find(c => c.id === 'strike');
                  if (strike) {
                      newPlayer.deck = newPlayer.deck.filter(c => c.uniqueId !== strike.uniqueId);
                  }
                  break;
          }
      });

      set({ player: newPlayer });
      if (shouldLeave) {
          get().skipReward(); // Return to map
      }
  },

  // ... (completeBattle, chooseReward, skipReward same as before) ...
  completeBattle: () => {
      const { map, currentMapNode, player } = get();
      if (!currentMapNode) return;

      let newPlayer = { ...player };
      if (player.relics.some(r => r.id === 'burning_blood')) {
          newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + 6);
      }

      const allCards = Object.values(CARDS);
      const rewards: Card[] = [];
      for(let i=0; i<3; i++) {
          const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
          rewards.push(randomCard);
      }

      set({ 
          player: newPlayer,
          rewardCards: rewards,
          currentScene: 'REWARD',
          enemies: [],
          hand: [],
          discardPile: [],
          drawPile: []
      });
  },

  chooseReward: (card: Card) => {
      const { player, map, currentMapNode } = get();
      if (!currentMapNode) return;

      const newCard: DeckCard = {
          id: card.id,
          uniqueId: Math.random().toString(36).substring(7),
          upgraded: false
      };

      const newPlayer = { ...player, deck: [...player.deck, newCard] };

      const newMap = map.map(layer => layer.map(node => {
          if (currentMapNode.next.includes(node.id)) {
              return { ...node, status: NodeStatus.AVAILABLE };
          }
          if (node.id === currentMapNode.id) {
              return { ...node, status: NodeStatus.COMPLETED };
          }
          return node;
      }));

      set({
          player: newPlayer,
          map: newMap,
          currentScene: 'MAP',
          rewardCards: []
      });
  },

  skipReward: () => {
      const { map, currentMapNode } = get();
      if (!currentMapNode) return;

       const newMap = map.map(layer => layer.map(node => {
          if (currentMapNode.next.includes(node.id)) {
              return { ...node, status: NodeStatus.AVAILABLE };
          }
          if (node.id === currentMapNode.id) {
              return { ...node, status: NodeStatus.COMPLETED };
          }
          return node;
      }));

      set({
          map: newMap,
          currentScene: 'MAP',
          rewardCards: []
      });
  },

  // ... (Battle Actions same as before) ...
  initializeBattle: (nodeType: NodeType) => {
    const rand = Math.random();
    let enemyTemplate = rand > 0.3 ? 'cultist' : 'jaw_worm';
    
    const player = get().player;
    
    const deckCards: PlayableCard[] = player.deck.map(deckCard => {
      const cardData = CARDS[deckCard.id];
      let finalCard = { ...cardData };
      if (deckCard.upgraded) {
          finalCard.description = cardData.upgradedDescription || cardData.description;
          finalCard.effects = cardData.upgradedEffects || cardData.effects;
          finalCard.cost = cardData.upgradedCost !== undefined ? cardData.upgradedCost : cardData.cost;
          finalCard.name += '+';
      }
      return {
        ...finalCard,
        uniqueId: Math.random().toString(36).substring(7),
        originalCost: finalCard.cost,
        upgraded: deckCard.upgraded
      };
    });

    const shuffledDeck = deckCards.sort(() => Math.random() - 0.5);
    const enemy = createEnemy('enemy-1', enemyTemplate);

    let initialStatus = [];
    if (player.relics.some(r => r.id === 'vajra')) {
        initialStatus.push({ id: 'strength', name: 'Strength', amount: 1, description: 'Relic Boost' });
    }
    
    let initialBlock = 0;
    if (player.relics.some(r => r.id === 'anchor')) {
        initialBlock = 10;
    }

    const battlePlayer = { ...player, statusEffects: [...player.statusEffects, ...initialStatus], block: initialBlock, energy: player.maxEnergy };
    const battleEnemy = { ...enemy };
    if (player.relics.some(r => r.id === 'bag_of_marbles')) {
        battleEnemy.statusEffects.push({ id: 'vulnerable', name: 'Vulnerable', amount: 1, description: 'Relic' });
    }

    set({
      player: battlePlayer,
      enemies: [battleEnemy],
      drawPile: shuffledDeck,
      discardPile: [],
      hand: [],
      currentTurn: 1,
      gameStatus: 'PLAYER_TURN',
      currentScene: 'BATTLE'
    });
    
    get().drawCards(5);
  },

  drawCards: (amount: number) => {
    const { drawPile, discardPile, hand } = get();
    let newDrawPile = [...drawPile];
    let newDiscardPile = [...discardPile];
    let newHand = [...hand];

    for (let i = 0; i < amount; i++) {
      if (newDrawPile.length === 0) {
        if (newDiscardPile.length === 0) break;
        newDrawPile = newDiscardPile.sort(() => Math.random() - 0.5);
        newDiscardPile = [];
      }
      const card = newDrawPile.pop();
      if (card) {
        newHand.push(card);
      }
    }

    set({
      drawPile: newDrawPile,
      discardPile: newDiscardPile,
      hand: newHand
    });
  },

  playCard: (card: PlayableCard, targetId?: string) => {
    const { player, enemies, hand, discardPile } = get();
    
    if (player.energy < card.cost) return;

    const newPlayer = { ...player, energy: player.energy - card.cost };
    let newEnemies = enemies.map(e => ({ ...e }));

    let targets: number[] = [];
    if (card.target === CardTarget.ALL_ENEMIES) {
        targets = newEnemies.map((_, i) => i);
    } else if (targetId) {
        const idx = newEnemies.findIndex(e => e.id === targetId);
        if (idx !== -1) targets.push(idx);
    } else if (newEnemies.length === 1 && card.target === CardTarget.ENEMY) {
        targets.push(0);
    }

    const strengthBuff = newPlayer.statusEffects.find(s => s.id === 'strength');
    const playerStrength = strengthBuff ? strengthBuff.amount : 0;

    card.effects.forEach(effect => {
        switch (effect.type) {
            case 'DEAL_DAMAGE':
                soundManager.playAttack();
                targets.forEach(idx => {
                    if (newEnemies[idx].hp > 0 && effect.value) {
                         let damage = effect.value + playerStrength;
                         const vulnerable = newEnemies[idx].statusEffects.find(s => s.id === 'vulnerable');
                         if (vulnerable) {
                             damage = Math.floor(damage * 1.5);
                         }
                         let block = newEnemies[idx].block;
                         if (block >= damage) {
                             newEnemies[idx].block -= damage;
                         } else {
                             damage -= block;
                             newEnemies[idx].block = 0;
                             newEnemies[idx].hp = Math.max(0, newEnemies[idx].hp - damage);
                         }
                         useVfxStore.getState().addDamageNumber(damage, 50, 40); 
                         useVfxStore.getState().triggerShake();
                    }
                });
                break;
            case 'GAIN_BLOCK':
                soundManager.playBlock();
                if (effect.value) {
                    newPlayer.block += effect.value;
                }
                break;
            case 'APPLY_VULNERABLE':
            case 'APPLY_WEAK':
            case 'APPLY_STRENGTH':
                 soundManager.playBuff();
                 break;
        }
        
        // Apply status effects logic
        if (effect.type === 'APPLY_VULNERABLE') {
                 targets.forEach(idx => {
                     if (newEnemies[idx].hp > 0 && effect.value) {
                         const existing = newEnemies[idx].statusEffects.find(s => s.id === 'vulnerable');
                         if (existing) {
                             existing.amount += effect.value;
                         } else {
                             newEnemies[idx].statusEffects.push({ id: 'vulnerable', name: 'Vulnerable', amount: effect.value, description: '' });
                         }
                     }
                 });
        } else if (effect.type === 'APPLY_WEAK') {
                 targets.forEach(idx => {
                     if (newEnemies[idx].hp > 0 && effect.value) {
                         const existing = newEnemies[idx].statusEffects.find(s => s.id === 'weak');
                         if (existing) {
                             existing.amount += effect.value;
                         } else {
                             newEnemies[idx].statusEffects.push({ id: 'weak', name: 'Weak', amount: effect.value, description: '' });
                         }
                     }
                 });
        } else if (effect.type === 'APPLY_STRENGTH') {
                 if (card.target === CardTarget.SELF) {
                     const existing = newPlayer.statusEffects.find(s => s.id === 'strength');
                     if (existing) {
                         existing.amount += (effect.value || 0);
                     } else {
                         newPlayer.statusEffects.push({ id: 'strength', name: 'Strength', amount: effect.value || 0, description: '' });
                     }
                 }
        }
    });

    const newHand = hand.filter(c => c.uniqueId !== card.uniqueId);
    const newDiscard = [...discardPile, card];

    const aliveEnemies = newEnemies.filter(e => e.hp > 0);
    let newGameStatus = get().gameStatus;
    if (aliveEnemies.length === 0) {
        newGameStatus = 'WON';
    }

    set({
        player: newPlayer,
        enemies: aliveEnemies,
        hand: newHand,
        discardPile: newDiscard,
        gameStatus: newGameStatus
    });
  },

  endTurn: () => {
      const { enemies, player, hand, discardPile, currentTurn } = get();

      if (get().gameStatus === 'WON') return;

      set({ gameStatus: 'ENEMY_TURN' });

      const newDiscard = [...discardPile, ...hand];
      let newPlayer = { ...player }; 
      
      let currentBlock = player.block;
      let currentHp = player.hp;

      let newEnemies = enemies.map(enemy => ({ ...enemy }));

      newEnemies.forEach(enemy => {
          const intent = enemy.intent;
          
          if (intent.type === IntentType.ATTACK && intent.damage) {
              soundManager.playAttack();
              useVfxStore.getState().triggerShake();
              let damage = intent.damage;
              const weak = enemy.statusEffects.find(s => s.id === 'weak');
              if (weak) {
                  damage = Math.floor(damage * 0.75);
              }
              
              if (currentBlock >= damage) {
                  currentBlock -= damage;
              } else {
                  damage -= currentBlock;
                  currentBlock = 0;
                  currentHp -= damage;
                  useVfxStore.getState().addDamageNumber(damage, 30, 70, 'text-red-600'); 
              }
          } else if (intent.type === IntentType.BUFF) {
              soundManager.playBuff();
              if (intent.statusId && intent.statusAmount) {
                  const existing = enemy.statusEffects.find(s => s.id === intent.statusId);
                  if (existing) {
                      existing.amount += intent.statusAmount;
                  } else {
                      enemy.statusEffects.push({ id: intent.statusId!, name: intent.statusId!, amount: intent.statusAmount, description: '' });
                  }
              }
          } else if (intent.type === IntentType.DEFEND) {
              soundManager.playBlock();
              if (intent.statusAmount) {
                  enemy.block += intent.statusAmount;
              }
          }

          enemy.statusEffects = enemy.statusEffects.map(s => {
              if (s.id === 'vulnerable' || s.id === 'weak') {
                  return { ...s, amount: s.amount - 1 };
              }
              return s;
          }).filter(s => s.amount > 0 || (s.id !== 'vulnerable' && s.id !== 'weak')); 

          enemy.intent = getNextIntent(enemy, currentTurn + 1);
      });

      newPlayer.hp = currentHp;
      newPlayer.block = 0; 
      newPlayer.energy = newPlayer.maxEnergy;

      let newStatus = 'PLAYER_TURN';
      if (newPlayer.hp <= 0) {
          newStatus = 'LOST';
      }

      set({
          player: newPlayer,
          hand: [],
          discardPile: newDiscard,
          currentTurn: currentTurn + 1,
          gameStatus: newStatus as any,
          enemies: newEnemies
      });

      if (newStatus === 'PLAYER_TURN') {
          get().drawCards(5);
      }
  }
}));
