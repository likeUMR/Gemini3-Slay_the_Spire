# Web版杀戮尖塔 (Slay the Spire Clone) - 项目结构文档

## 1. 技术栈选型 (推荐)
- **核心语言**: TypeScript (强类型对于复杂的游戏逻辑至关重要)
- **构建工具**: Vite (快速开发与构建)
- **UI 框架**: React (适合处理复杂的卡牌状态和界面更新)
- **状态管理**: Zustand 或 Redux Toolkit (管理全局游戏状态：生命值、卡组、遗物等)
- **样式处理**: TailwindCSS 或 CSS Modules
- **动画库**: Framer Motion (用于卡牌抽击、敌人意图等UI动画)

## 2. 目录结构概览

```text
root/
├── public/                 # 静态资源 (图片, 音效, 字体)
│   ├── assets/
│   │   ├── cards/          # 卡牌插图
│   │   ├── enemies/        # 敌人素材
│   │   ├── vfx/            # 特效图片
│   │   └── audio/          # 音效与背景乐
├── src/
│   ├── core/               # 纯游戏逻辑 (不依赖 React/UI)
│   │   ├── battle/         # 战斗系统逻辑
│   │   │   ├── BattleManager.ts  # 战斗流程控制器
│   │   │   ├── TurnManager.ts    # 回合管理
│   │   │   └── DamageCalculator.ts # 伤害计算公式
│   │   ├── cards/          # 卡牌核心逻辑
│   │   │   ├── CardFactory.ts    # 卡牌生成工厂
│   │   │   ├── CardEffect.ts     # 卡牌效果解析器
│   │   │   └── types.ts          # 卡牌类型定义
│   │   ├── entities/       # 实体定义
│   │   │   ├── Player.ts         # 玩家类 (状态, 能量, 手牌)
│   │   │   └── Enemy.ts          # 敌人类 (AI, 意图)
│   │   ├── map/            # 地图生成逻辑
│   │   │   ├── MapGenerator.ts   # 过程生成地图算法
│   │   │   └── NodeTypes.ts      # 节点类型 (战斗, 商店, 精英, 篝火)
│   │   ├── relics/         # 遗物系统
│   │   └── status/         # 状态效果 (易伤, 虚弱, 力量)
│   │
│   ├── data/               # 静态游戏数据 (JSON/Config)
│   │   ├── cards.json      # 所有卡牌的属性配置
│   │   ├── enemies.json    # 敌人数据与行为模式
│   │   ├── relics.json     # 遗物数据
│   │   └── events.json     # 随机事件配置
│   │
│   ├── store/              # 全局状态管理 (React Hooks/Zustand)
│   │   ├── useGameStore.ts # 核心游戏状态 (当前HP, 金币, 所在层数)
│   │   ├── useDeckStore.ts # 卡组状态 (抽牌堆, 弃牌堆, 手牌)
│   │   └── useSettings.ts  # 设置 (音量, 偏好)
│   │
│   ├── components/         # UI 组件
│   │   ├── battle/         # 战斗场景组件
│   │   │   ├── Card.tsx          # 单张卡牌组件
│   │   │   ├── Hand.tsx          # 手牌区
│   │   │   ├── PlayerUnit.tsx    # 玩家显示 (HP, Buffs)
│   │   │   ├── EnemyUnit.tsx     # 敌人显示 (HP, 意图, Buffs)
│   │   │   └── EnergyOrb.tsx     # 能量球
│   │   ├── map/            # 地图场景组件
│   │   │   ├── DungeonMap.tsx    # 地图视图
│   │   │   └── MapNode.tsx       # 单个节点
│   │   ├── ui/             # 通用 UI
│   │   │   ├── Tooltip.tsx       # 关键词提示
│   │   │   ├── Button.tsx
│   │   │   └── HealthBar.tsx
│   │   └── scenes/         # 主要场景容器
│   │       ├── BattleScene.tsx
│   │       ├── MapScene.tsx
│   │       ├── EventScene.tsx
│   │       └── MainMenu.tsx
│   │
│   ├── utils/              # 工具函数
│   │   ├── rng.ts          # 随机数生成器 (支持种子)
│   │   └── assetLoader.ts  # 资源预加载
│   │
│   ├── App.tsx             # 根组件 (场景路由)
│   └── main.tsx            # 入口文件
│
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 3. 核心模块设计思路

### 3.1 卡牌系统 (Card System)
- **数据驱动**: 卡牌不应硬编码为类，而是通过 `data/cards.json` 定义 ID、费用、类型（攻击/技能/能力）、数值和效果标签。
- **效果解析**: `CardEffect` 解析器负责将 JSON 中的 "DEAL_DAMAGE 6" 转化为实际的游戏逻辑。

### 3.2 战斗流程 (Combat Loop)
1. **回合开始 (Start Turn)**: 触发遗物/Buff，重置格挡，抽牌，恢复能量。
2. **玩家行动 (Player Phase)**: 玩家打出卡牌 -> 结算卡牌效果 -> 更新敌人状态 -> 检查战斗结束。
3. **敌人行动 (Enemy Phase)**: 遍历所有存活敌人 -> 执行预告的意图 (Intent) -> 结算伤害/Buff。
4. **回合结束 (End Turn)**: 弃掉手牌，触发结束回合效果。

### 3.3 意图系统 (Intent System)
类似杀戮尖塔的核心机制，敌人必须在玩家回合明确显示其下回合动作（攻击多少伤害、施加什么Debuff、格挡等）。

### 3.4 地图系统 (Map System)
使用 **过程生成 (Procedural Generation)** 算法生成树状结构的地图节点。每一层都是一个有向无环图 (DAG)。

## 4. 开发路线图 (Roadmap)

1. **Phase 1: 基础架构**: 搭建项目，配置 TypeScript 和 Tailwind。
2. **Phase 2: 核心战斗循环**: 实现最基础的“打一张打击卡造成6点伤害”。
3. **Phase 3: 数据层**: 建立 JSON 数据结构并加载。
4. **Phase 4: 敌人AI与意图**: 让敌人会攻击和显示意图。
5. **Phase 5: 流程控制**: 胜利/失败判定，抽牌/弃牌逻辑。
6. **Phase 6: 地图与导航**: 在战斗之间移动。
```
