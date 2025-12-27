import type { FarmerState } from '../types/game';

export class Farmer {
  private state: FarmerState;
  private readonly BASE_MAX_PIGS = 5; // 基础最大猪数量
  private readonly PEN_UPGRADE_COST = 1000; // 猪舍升级成本
  private readonly PEN_UPGRADE_INCREASE = 5; // 每次升级增加的猪数量
  private readonly FEED_PER_PIG = 2; // 每头猪每天消耗的饲料量
  private readonly GROWTH_RATE = 0.2; // 每天成长为可出栏猪的比例

  constructor() {
    this.state = this.getInitialState();
  }

  // 获取初始状态
  private getInitialState(): FarmerState {
    return {
      money: 1000,
      feedStock: 50,
      feedConsumption: 0,
      fatteningPigs: 2,
      readyPigs: 0,
      maxPigs: this.BASE_MAX_PIGS
    };
  }

  // 获取当前状态
  getState(): FarmerState {
    return { ...this.state };
  }

  // 设置状态
  setState(state: Partial<FarmerState>): void {
    this.state = { ...this.state, ...state };
  }

  // 购买饲料
  buyFeed(amount: number, price: number): boolean {
    const totalCost = amount * price;
    if (this.state.money < totalCost) {
      return false; // 资金不足
    }
    
    this.state.money -= totalCost;
    this.state.feedStock += amount;
    return true;
  }

  // 购买猪
  buyPig(amount: number, cost: number): boolean {
    const totalCost = amount * cost;
    const totalPigs = this.state.fatteningPigs + this.state.readyPigs + amount;
    if (this.state.money < totalCost || totalPigs > this.state.maxPigs) {
      return false; // 资金不足或猪舍已满
    }
    
    this.state.money -= totalCost;
    this.state.fatteningPigs += amount;
    return true;
  }

  // 出售猪
  sellPig(amount: number, revenuePerPig: number): boolean {
    if (this.state.readyPigs < amount) {
      return false; // 可出栏猪数量不足
    }
    
    const totalRevenue = amount * revenuePerPig;
    this.state.money += totalRevenue;
    this.state.readyPigs -= amount;
    return true;
  }

  // 升级猪舍
  upgradePen(): boolean {
    if (this.state.money < this.PEN_UPGRADE_COST) {
      return false; // 资金不足
    }
    
    this.state.money -= this.PEN_UPGRADE_COST;
    this.state.maxPigs += this.PEN_UPGRADE_INCREASE;
    return true;
  }

  // 一天过去
  passDay(): void {
    // 计算总猪数量
    const totalPigs = this.state.fatteningPigs + this.state.readyPigs;
    
    // 计算饲料消耗量
    const feedConsumption = Math.min(this.state.feedStock, totalPigs * this.FEED_PER_PIG);
    this.state.feedConsumption = feedConsumption;
    this.state.feedStock -= feedConsumption;
    
    // 计算成长为可出栏猪的数量（基于育肥猪数量）
    const newReadyPigs = Math.floor(this.state.fatteningPigs * this.GROWTH_RATE);
    if (newReadyPigs > 0) {
      this.state.fatteningPigs -= newReadyPigs;
      this.state.readyPigs += newReadyPigs;
    }
  }
}