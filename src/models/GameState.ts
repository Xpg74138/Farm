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
    // 猪仔价格使用市场中的pigletPrice
    const pigletPrice = this.market.getState().pigletPrice;
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
    
    // 生成每日事件
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
  
  // 解决事件并应用效果
  resolveEvent(eventId: string): boolean {
    const eventIndex = this.state.events.findIndex(e => e.id === eventId && !e.resolved);
    if (eventIndex === -1) {
      return false; // 事件不存在或已解决
    }
    
    const event = this.state.events[eventIndex];
    if (event.effect) {
      // 应用事件效果
      const effect = this.eventManager.applyEventEffect(event);
      
      // 更新农民状态
      const farmerState = this.farmer.getState();
      this.farmer.setState({
        ...farmerState,
        money: parseFloat((farmerState.money + effect.money).toFixed(2)),
        feedStock: parseFloat(Math.max(0, farmerState.feedStock + effect.feedStock).toFixed(2)),
        fatteningPigs: parseFloat(Math.max(0, farmerState.fatteningPigs + (effect.fatteningPigs || 0)).toFixed(2)),
        readyPigs: parseFloat(Math.max(0, farmerState.readyPigs + (effect.readyPigs || 0)).toFixed(2))
      });
    }
    
    // 标记事件为已解决
    this.state.events[eventIndex] = this.eventManager.resolveEvent(event);
    return true;
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