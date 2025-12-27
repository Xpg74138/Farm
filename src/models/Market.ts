import type { MarketState } from '../types/game';

export class Market {
  private state: MarketState;
  private readonly BASE_PORK_PRICE = 20; // 基础猪肉价格
  private readonly BASE_FEED_PRICE = 5; // 基础饲料价格
  private readonly BASE_PIGLET_PRICE = 250; // 基础仔猪价格
  private readonly PORK_PRICE_FLUCTUATION = 0.2; // 猪肉价格波动幅度（20%）
  private readonly FEED_PRICE_FLUCTUATION = 0.2; // 饲料价格波动幅度（20%）
  private readonly PIGLET_PRICE_FLUCTUATION = 0.2; // 仔猪价格波动幅度（20%）
  private readonly PIGLET_PRICE_MIN = 200; // 仔猪最低价格
  private readonly PIGLET_PRICE_MAX = 300; // 仔猪最高价格

  constructor() {
    this.state = this.getInitialState();
  }

  // 获取初始状态
  private getInitialState(): MarketState {
    return {
      porkPrice: this.BASE_PORK_PRICE,
      feedPrice: this.BASE_FEED_PRICE,
      pigletPrice: this.BASE_PIGLET_PRICE
    };
  }

  // 获取当前状态
  getState(): MarketState {
    return { ...this.state };
  }

  // 设置状态
  setState(state: Partial<MarketState>): void {
    this.state = { ...this.state, ...state };
  }

  // 更新市场状态（每天）
  updateMarket(): void {
    // 猪肉价格随机波动
    const porkPriceVariation = this.BASE_PORK_PRICE * this.PORK_PRICE_FLUCTUATION;
    this.state.porkPrice = parseFloat(
      (this.BASE_PORK_PRICE + (Math.random() * porkPriceVariation * 2 - porkPriceVariation)).toFixed(2)
    );

    // 饲料价格随机波动
    const feedPriceVariation = this.BASE_FEED_PRICE * this.FEED_PRICE_FLUCTUATION;
    this.state.feedPrice = parseFloat(
      (this.BASE_FEED_PRICE + (Math.random() * feedPriceVariation * 2 - feedPriceVariation)).toFixed(2)
    );

    // 仔猪价格在200-300之间随机波动
    const pigletPriceVariation = this.BASE_PIGLET_PRICE * this.PIGLET_PRICE_FLUCTUATION;
    let newPigletPrice = parseFloat(
      (this.BASE_PIGLET_PRICE + (Math.random() * pigletPriceVariation * 2 - pigletPriceVariation)).toFixed(2)
    );
    // 确保仔猪价格在200-300之间
    this.state.pigletPrice = Math.max(this.PIGLET_PRICE_MIN, Math.min(this.PIGLET_PRICE_MAX, newPigletPrice));
  }

  // 获取当前市场摘要
  getMarketSummary(): string {
    return `猪肉价格：¥${this.state.porkPrice}/kg，饲料价格：¥${this.state.feedPrice}/单位，仔猪价格：¥${this.state.pigletPrice}/只`;
  }
}