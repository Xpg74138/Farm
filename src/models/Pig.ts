import type { PigState } from '../types/game';

export class Pig {
  private state: PigState;
  private readonly MAX_AGE = 180; // 最大年龄（天）
  private readonly MARKET_WEIGHT = 100; // 出栏体重（kg）

  constructor() {
    this.state = this.getInitialState();
  }

  // 获取初始状态
  private getInitialState(): PigState {
    return {
      health: 100,
      hunger: 50,
      happiness: 70,
      weight: 1.0,
      age: 0,
      isAlive: true
    };
  }

  // 获取当前状态
  getState(): PigState {
    return { ...this.state };
  }

  // 设置状态
  setState(state: Partial<PigState>): void {
    this.state = { ...this.state, ...state };
  }

  // 喂食
  feed(): void {
    if (!this.state.isAlive) return;
    
    this.state.hunger = Math.min(100, this.state.hunger + 30);
    this.state.health = Math.min(100, this.state.health + 5);
    this.state.happiness = Math.min(100, this.state.happiness + 10);
    this.state.weight += 0.5;
  }

  // 睡觉
  sleep(): void {
    if (!this.state.isAlive) return;
    
    this.state.health = Math.min(100, this.state.health + 15);
    this.state.happiness = Math.min(100, this.state.happiness + 5);
    this.state.hunger = Math.max(0, this.state.hunger - 10);
  }

  // 玩耍
  play(): void {
    if (!this.state.isAlive) return;
    
    this.state.happiness = Math.min(100, this.state.happiness + 25);
    this.state.health = Math.min(100, this.state.health + 5);
    this.state.hunger = Math.max(0, this.state.hunger - 15);
    this.state.weight = Math.max(1.0, this.state.weight - 0.2);
  }

  // 一天过去
  passDay(): void {
    if (!this.state.isAlive) return;
    
    this.state.age += 1;
    this.state.hunger = Math.max(0, this.state.hunger - 20);
    this.state.happiness = Math.max(0, this.state.happiness - 10);
    
    // 饥饿影响健康
    if (this.state.hunger < 30) {
      this.state.health = Math.max(0, this.state.health - 15);
    }
    
    // 快乐影响健康
    if (this.state.happiness < 30) {
      this.state.health = Math.max(0, this.state.health - 10);
    }
    
    // 健康自然恢复
    if (this.state.hunger > 50 && this.state.happiness > 50) {
      this.state.health = Math.min(100, this.state.health + 5);
    }
    
    // 体重增长
    if (this.state.hunger > 70) {
      this.state.weight += 1.0;
    } else if (this.state.hunger > 30) {
      this.state.weight += 0.5;
    }
    
    // 检查是否存活
    if (this.state.health <= 0 || this.state.age >= this.MAX_AGE) {
      this.state.isAlive = false;
    }
  }

  // 检查是否可以出栏
  canBeSold(): boolean {
    return this.state.isAlive && this.state.weight >= this.MARKET_WEIGHT;
  }

  // 获取出栏价值
  getMarketValue(porkPrice: number): number {
    return this.state.weight * porkPrice;
  }
}