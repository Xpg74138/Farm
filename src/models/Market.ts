import type { MarketState } from '../types/game';

export class Market {
  private state: MarketState;
  private readonly BASE_PORK_PRICE = 20; // 基础猪肉价格
  private readonly BASE_FEED_PRICE = 5; // 基础饲料价格
  private readonly PRICE_FLUCTUATION = 0.2; // 价格波动幅度（20%）

  constructor() {
    this.state = this.getInitialState();
  }

  // 获取初始状态
  private getInitialState(): MarketState {
    return {
      porkPrice: this.BASE_PORK_PRICE,
      feedPrice: this.BASE_FEED_PRICE,
      demand: 50
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
    // 更新需求（随机波动）
    this.state.demand += Math.floor(Math.random() * 21) - 10; // -10 到 +10
    this.state.demand = Math.max(0, Math.min(100, this.state.demand));

    // 根据需求调整猪肉价格
    const demandFactor = this.state.demand / 50; // 需求系数（0-2）
    const porkPriceBase = this.BASE_PORK_PRICE * demandFactor;
    const porkPriceVariation = porkPriceBase * this.PRICE_FLUCTUATION;
    this.state.porkPrice = parseFloat(
      (porkPriceBase + (Math.random() * porkPriceVariation * 2 - porkPriceVariation)).toFixed(2)
    );

    // 饲料价格随机波动
    const feedPriceVariation = this.BASE_FEED_PRICE * this.PRICE_FLUCTUATION;
    this.state.feedPrice = parseFloat(
      (this.BASE_FEED_PRICE + (Math.random() * feedPriceVariation * 2 - feedPriceVariation)).toFixed(2)
    );
  }

  // 获取当前市场摘要
  getMarketSummary(): string {
    if (this.state.demand > 80) {
      return '市场需求旺盛，猪肉价格上涨！';
    } else if (this.state.demand > 60) {
      return '市场需求良好，猪肉价格稳定。';
    } else if (this.state.demand > 40) {
      return '市场需求一般，猪肉价格平稳。';
    } else if (this.state.demand > 20) {
      return '市场需求疲软，猪肉价格下跌。';
    } else {
      return '市场需求低迷，猪肉价格大幅下跌！';
    }
  }
}