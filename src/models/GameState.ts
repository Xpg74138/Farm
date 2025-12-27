import type { GameState as GameStateType, GameEventData } from '../types/game';
import { Farmer } from './Farmer';
import { Market } from './Market';
import { EventManager } from '../services/EventManager';

export class GameState {
  private state: GameStateType;
  private farmer: Farmer;
  private market: Market;
  private eventManager: EventManager;

  constructor() {
    this.farmer = new Farmer();
    this.market = new Market();
    this.eventManager = new EventManager();
    this.state = this.getInitialState();
  }

  // 获取初始状态
  private getInitialState(): GameStateType {
    return {
      characterType: 'farmer', // 固定为养猪人角色
      pigState: {
        health: 100,
        hunger: 50,
        happiness: 70,
        weight: 1.0,
        age: 0,
        isAlive: true
      },
      farmerState: this.farmer.getState(),
      marketState: this.market.getState(),
      day: 1,
      gameSpeed: 3,
      volume: 50,
      events: [] // 初始事件列表为空
    };
  }

  // 获取当前状态
  getState(): GameStateType {
    return {
      ...this.state,
      farmerState: this.farmer.getState(),
      marketState: this.market.getState()
    };
  }

  // 加载状态
  loadState(savedState: GameStateType): void {
    this.state = {
      ...savedState,
      farmerState: savedState.farmerState,
      marketState: savedState.marketState,
      events: savedState.events || []
    };
    
    // 更新各个模型的状态
    this.farmer.setState(savedState.farmerState);
    this.market.setState(savedState.marketState);
  }

  // 养猪人角色行为
  farmerBuyFeed(amount: number): boolean {
    return this.farmer.buyFeed(amount, this.market.getState().feedPrice);
  }

  farmerSellPig(amount: number): boolean {
    // 简化处理，假设每头猪的平均重量为100kg
    const porkPrice = this.market.getState().porkPrice;
    const revenuePerPig = 100 * porkPrice;
    return this.farmer.sellPig(amount, revenuePerPig);
  }

  farmerBuyPig(amount: number): boolean {
    // 猪仔价格基于当前市场价格
    const porkPrice = this.market.getState().porkPrice;
    const pigletPrice = porkPrice * 10;
    return this.farmer.buyPig(amount, pigletPrice);
  }

  farmerUpgradePen(): boolean {
    return this.farmer.upgradePen();
  }

  // 一天过去
  passDay(): void {
    this.state.day += 1;
    
    // 更新各个实体的状态
    this.farmer.passDay();
    this.market.updateMarket();
    
    // 生成每日事件，但不自动处理，让玩家手动处理
    this.generateDailyEvents();
  }

  // 生成每日事件
  private generateDailyEvents(): void {
    const newEvents = this.eventManager.generateDailyEvents(this.state.day);
    this.state.events = [...this.state.events, ...newEvents];
  }



  // 获取当前事件列表
  getEvents(): GameEventData[] {
    return this.state.events;
  }

  // 设置游戏速度
  setGameSpeed(speed: number): void {
    this.state.gameSpeed = Math.max(1, Math.min(5, speed));
  }

  // 设置音量
  setVolume(volume: number): void {
    this.state.volume = Math.max(0, Math.min(100, volume));
  }

  // 获取养猪人模型实例
  getFarmer(): Farmer {
    return this.farmer;
  }

  // 获取市场模型实例
  getMarket(): Market {
    return this.market;
  }
}