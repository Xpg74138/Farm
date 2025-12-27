import type { FarmerState } from '../types/game';

export class Farmer {
  private state: FarmerState;
  private readonly BASE_MAX_PIGS = 5; // 基础最大猪数量
  private readonly PEN_UPGRADE_COST = 1000; // 猪舍升级成本
  private readonly PEN_UPGRADE_INCREASE = 5; // 每次升级增加的猪数量
  private readonly FEED_PER_PIG = 2; // 每头猪每天消耗的饲料量

  constructor() {
    this.state = this.getInitialState();
  }

  // 获取初始状态
  private getInitialState(): FarmerState {
    const initialFatteningPigs = 2;
    const initialReadyPigs = 0;
    const initialTotalPigs = initialFatteningPigs + initialReadyPigs;
    
    return {
      money: 1000,
      feedStock: 50,
      feedConsumption: initialTotalPigs * this.FEED_PER_PIG,
      fatteningPigs: initialFatteningPigs,
      readyPigs: initialReadyPigs,
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
    const totalCost = parseFloat((amount * price).toFixed(2));
    if (this.state.money < totalCost) {
      return false; // 资金不足
    }
    
    this.state.money = parseFloat((this.state.money - totalCost).toFixed(2));
    this.state.feedStock = parseFloat((this.state.feedStock + amount).toFixed(2));
    return true;
  }

  // 购买猪
  buyPig(amount: number, cost: number): boolean {
    const totalCost = parseFloat((amount * cost).toFixed(2));
    const totalPigs = this.state.fatteningPigs + this.state.readyPigs + amount;
    if (this.state.money < totalCost || totalPigs > this.state.maxPigs) {
      return false; // 资金不足或猪舍已满
    }
    
    this.state.money = parseFloat((this.state.money - totalCost).toFixed(2));
    this.state.fatteningPigs = parseFloat((this.state.fatteningPigs + amount).toFixed(2));
    return true;
  }

  // 出售猪
  sellPig(amount: number, revenuePerPig: number): boolean {
    if (this.state.readyPigs < amount) {
      return false; // 可出栏猪数量不足
    }
    
    const totalRevenue = parseFloat((amount * revenuePerPig).toFixed(2));
    this.state.money = parseFloat((this.state.money + totalRevenue).toFixed(2));
    this.state.readyPigs = parseFloat((this.state.readyPigs - amount).toFixed(2));
    return true;
  }

  // 升级猪舍
  upgradePen(): boolean {
    if (this.state.money < this.PEN_UPGRADE_COST) {
      return false; // 资金不足
    }
    
    this.state.money = parseFloat((this.state.money - this.PEN_UPGRADE_COST).toFixed(2));
    this.state.maxPigs = parseFloat((this.state.maxPigs + this.PEN_UPGRADE_INCREASE).toFixed(2));
    return true;
  }

  // 一天过去
  passDay(): void {
    // 计算总猪数量
    const totalPigs = this.state.fatteningPigs + this.state.readyPigs;
    
    // 计算饲料消耗量（每猪每天2单位）
    const feedConsumption = parseFloat(
      Math.min(this.state.feedStock, totalPigs * this.FEED_PER_PIG).toFixed(2)
    );
    this.state.feedConsumption = feedConsumption;
    this.state.feedStock = parseFloat((this.state.feedStock - feedConsumption).toFixed(2));
    
    // 只有当饲料充足时，育肥猪才会成长
    if (feedConsumption >= totalPigs * this.FEED_PER_PIG) {
      // 计算育肥猪成长
      const newReadyPigs = Math.floor(this.state.fatteningPigs * 0.2); // 20%的育肥猪成长为可出栏猪
      if (newReadyPigs > 0) {
        this.state.fatteningPigs = parseFloat((this.state.fatteningPigs - newReadyPigs).toFixed(2));
        this.state.readyPigs = parseFloat((this.state.readyPigs + newReadyPigs).toFixed(2));
      }
    }
  }
}