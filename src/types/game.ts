// 游戏角色类型
export type CharacterType = 'pig' | 'farmer';

// 猪的状态类型
export interface PigState {
  health: number;      // 健康值 0-100
  hunger: number;      // 饥饿值 0-100
  happiness: number;   // 快乐值 0-100
  weight: number;      // 体重（kg）
  age: number;         // 年龄（天）
  isAlive: boolean;    // 是否存活
}

// 猪个体类型
export interface Pig {
  id: string;
  weight: number;      // 当前体重（kg）
  daysOld: number;     // 天数
  isReadyForSale: boolean; // 是否可出栏（体重 >= 150kg）
}

// 养猪人的状态类型
export interface FarmerState {
  money: number;           // 金钱
  feedStock: number;       // 饲料库存
  feedConsumption: number; // 每日饲料消耗量
  fatteningPigs: number;   // 育肥猪数量
  readyPigs: number;       // 可出栏猪数量
  maxPigs: number;         // 最大猪数量
}

// 市场状态类型
export interface MarketState {
  porkPrice: number;   // 猪肉价格（元/kg）
  feedPrice: number;   // 饲料价格（元/单位）
  pigletPrice: number; // 仔猪价格（元/只）
}

// 事件类型
export type EventType = 'info' | 'opportunity' | 'warning' | 'danger';

// 游戏事件数据类型
export interface GameEventData {
  id: string;
  title: string;
  description: string;
  type: EventType;
  day: number;
  resolved: boolean;
  effect?: {
    money?: number;
    feedStock?: number;
    fatteningPigs?: number;
    readyPigs?: number;
  };
}

// 游戏状态类型
export interface GameState {
  characterType: CharacterType | null;
  pigState: PigState;
  farmerState: FarmerState;
  marketState: MarketState;
  day: number;         // 游戏天数
  gameSpeed: number;   // 游戏速度（1-5）
  volume: number;      // 音量（0-100）
  events: GameEventData[]; // 当前事件列表
}

// 游戏内部事件类型
export type GameInternalEvent = {
  type: 'DAY_PASSED' | 'PIG_FEED' | 'PIG_SLEEP' | 'PIG_PLAY' | 'PIG_SOLD' | 'FEED_BOUGHT' | 'PEN_UPGRADED' | 'EVENT_TRIGGERED';
  data?: any;
};

// 存档类型
export interface GameSave {
  id: string;
  name: string;
  timestamp: number;
  state: GameState;
}
