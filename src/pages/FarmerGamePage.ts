import { Button } from '../components/Button';
import type { FarmerState, MarketState, GameEventData } from '../types/game';

export class FarmerGamePage {
  private element: HTMLDivElement;
  private onBuyFeed: (amount: number) => void;
  private onSellPig: (amount: number) => void;
  private onBuyPig: (amount: number) => void;
  private onUpgradePen: () => void;
  private onNextDay: () => void;
  private onBack: () => void;
  private onResolveEvent: (eventId: string) => void;
  private farmerState: FarmerState;
  private marketState: MarketState;
  private events: GameEventData[];
  private day: number;

  constructor(
    onBuyFeed: (amount: number) => void, 
    onSellPig: (amount: number) => void, 
    onBuyPig: (amount: number) => void, 
    onUpgradePen: () => void, 
    onNextDay: () => void,
    onBack: () => void,
    onResolveEvent: (eventId: string) => void
  ) {
    this.element = document.createElement('div');
    this.element.className = 'page farmer-game-page';
    this.onBuyFeed = onBuyFeed;
    this.onSellPig = onSellPig;
    this.onBuyPig = onBuyPig;
    this.onUpgradePen = onUpgradePen;
    this.onNextDay = onNextDay;
    this.onBack = onBack;
    this.onResolveEvent = onResolveEvent;
    
    // 初始状态
    this.farmerState = {
      money: 1000,
      feedStock: 50,
      feedConsumption: 4, // 初始2头育肥猪，每头2单位饲料
      fatteningPigs: 2,
      readyPigs: 0,
      maxPigs: 5
    };
    
    this.marketState = {
      porkPrice: 20,
      feedPrice: 5,
      pigletPrice: 250
    };
    
    this.events = [];
    this.day = 1;
    
    this.render();
  }

  // 渲染页面
  private render(): void {
    // 游戏容器
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
    
    // 标题
    const title = document.createElement('h1');
    title.className = 'pixel-title';
    title.textContent = '养猪场管理';
    gameContainer.appendChild(title);
    
    // 游戏天数显示
    const dayDisplay = document.createElement('div');
    dayDisplay.className = 'day-display';
    dayDisplay.textContent = `第 ${this.day} 天`;
    gameContainer.appendChild(dayDisplay);
    
    // 主游戏区域 - 改为左右布局
    const mainArea = document.createElement('div');
    mainArea.className = 'game-main';
    mainArea.style.display = 'flex';
    mainArea.style.gap = '30px';
    mainArea.style.width = '100%';
    
    // 左侧事件区域
    const eventArea = this.createEventArea();
    mainArea.appendChild(eventArea);
    
    // 右侧主内容区域
    const contentArea = document.createElement('div');
    contentArea.style.flex = '1';
    contentArea.style.display = 'flex';
    contentArea.style.flexDirection = 'column';
    contentArea.style.gap = '20px';
    
    // 农场状态面板
    const farmStats = document.createElement('div');
    farmStats.className = 'pixel-container';
    farmStats.style.width = '100%';
    
    // 农场状态标题
    const farmStatsTitle = document.createElement('h3');
    farmStatsTitle.className = 'pixel-subtitle';
    farmStatsTitle.style.fontSize = '20px';
    farmStatsTitle.textContent = '农场状态';
    farmStats.appendChild(farmStatsTitle);
    
    // 农场状态内容
    const farmStatsContent = document.createElement('div');
    farmStatsContent.style.display = 'grid';
    farmStatsContent.style.gridTemplateColumns = 'repeat(2, 1fr)';
    farmStatsContent.style.gap = '15px';
    
    // 金钱
    farmStatsContent.appendChild(this.createStatItem('金钱', `¥${this.farmerState.money}`));
    
    // 饲料库存
    farmStatsContent.appendChild(this.createStatItem('饲料库存', `${this.farmerState.feedStock} 单位`));
    
    // 饲料消耗量
    farmStatsContent.appendChild(this.createStatItem('饲料消耗', `${this.farmerState.feedConsumption} 单位/天`));
    
    // 育肥猪数量
    farmStatsContent.appendChild(this.createStatItem('育肥猪', `${this.farmerState.fatteningPigs}`));
    
    // 可出栏猪数量
    farmStatsContent.appendChild(this.createStatItem('可出栏猪', `${this.farmerState.readyPigs}`));
    
    // 总猪数量
    const totalPigs = this.farmerState.fatteningPigs + this.farmerState.readyPigs;
    farmStatsContent.appendChild(this.createStatItem('总猪数量', `${totalPigs}/${this.farmerState.maxPigs}`));
    
    farmStats.appendChild(farmStatsContent);
    contentArea.appendChild(farmStats);
    
    // 市场信息面板
    const marketPanel = document.createElement('div');
    marketPanel.className = 'pixel-container';
    marketPanel.style.width = '100%';
    
    // 市场标题
    const marketTitle = document.createElement('h3');
    marketTitle.className = 'pixel-subtitle';
    marketTitle.style.fontSize = '20px';
    marketTitle.textContent = '市场信息';
    marketPanel.appendChild(marketTitle);
    
    // 市场内容
    const marketContent = document.createElement('div');
    marketContent.style.display = 'grid';
    marketContent.style.gridTemplateColumns = 'repeat(2, 1fr)';
    marketContent.style.gap = '15px';
    
    // 猪肉价格
    marketContent.appendChild(this.createStatItem('猪肉价格', `¥${this.marketState.porkPrice}/kg`));
    
    // 饲料价格
    marketContent.appendChild(this.createStatItem('饲料价格', `¥${this.marketState.feedPrice}/单位`));
    
    // 仔猪价格
    marketContent.appendChild(this.createStatItem('仔猪价格', `¥${this.marketState.pigletPrice}/只`));
    
    marketPanel.appendChild(marketContent);
    contentArea.appendChild(marketPanel);
    
    // 控制按钮
    const controls = document.createElement('div');
    controls.className = 'game-controls';
    controls.style.flexWrap = 'wrap';
    controls.style.justifyContent = 'center';
    
    const buyFeedButton = new Button('购买饲料', () => this.showQuantityModal('购买饲料', this.onBuyFeed, this.calculateMaxBuyFeed()));
    controls.appendChild(buyFeedButton.getElement());
    
    const sellPigButton = new Button('出售猪', () => this.showQuantityModal('出售猪', this.onSellPig, this.farmerState.readyPigs));
    controls.appendChild(sellPigButton.getElement());
    
    const buyPigButton = new Button('购买猪仔', () => this.showQuantityModal('购买猪仔', this.onBuyPig, this.calculateMaxBuyPig()));
    controls.appendChild(buyPigButton.getElement());
    
    const upgradeButton = new Button('升级猪舍', this.onUpgradePen);
    controls.appendChild(upgradeButton.getElement());
    
    // 下一天按钮（单独一行显示）
    const nextDayButton = new Button('下一天', this.onNextDay);
    nextDayButton.getElement().style.backgroundColor = '#2E8B57'; // 绿色按钮
    nextDayButton.getElement().style.marginTop = '15px';
    nextDayButton.getElement().style.padding = '15px 30px';
    nextDayButton.getElement().style.fontSize = '18px';
    controls.appendChild(nextDayButton.getElement());
    
    const backButton = new Button('返回', this.onBack);
    controls.appendChild(backButton.getElement());
    
    contentArea.appendChild(controls);
    
    // 将右侧内容添加到主区域
    mainArea.appendChild(contentArea);
    gameContainer.appendChild(mainArea);
    
    this.element.appendChild(gameContainer);
  }

  // 计算最大可购买饲料数量
  private calculateMaxBuyFeed(): number {
    return Math.floor(this.farmerState.money / this.marketState.feedPrice);
  }

  // 计算最大可购买猪仔数量
  private calculateMaxBuyPig(): number {
    const totalPigs = this.farmerState.fatteningPigs + this.farmerState.readyPigs;
    const availableSpace = this.farmerState.maxPigs - totalPigs;
    const maxAffordable = Math.floor(this.farmerState.money / this.marketState.pigletPrice);
    return Math.max(0, Math.min(availableSpace, maxAffordable));
  }

  // 显示数量选择弹窗
  private showQuantityModal(title: string, callback: (amount: number) => void, maxAmount: number): void {
    // 创建弹窗背景
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.zIndex = '1000';
    
    // 创建弹窗容器
    const modal = document.createElement('div');
    modal.className = 'pixel-container';
    modal.style.padding = '20px';
    modal.style.backgroundColor = '#f0e68c';
    modal.style.border = '3px solid #000';
    modal.style.borderRadius = '8px';
    modal.style.width = '300px';
    modal.style.textAlign = 'center';
    
    // 弹窗标题
    const modalTitle = document.createElement('h3');
    modalTitle.className = 'pixel-subtitle';
    modalTitle.style.marginBottom = '15px';
    modalTitle.textContent = title;
    modal.appendChild(modalTitle);
    
    // 数量输入
    const inputContainer = document.createElement('div');
    inputContainer.style.marginBottom = '15px';
    
    const label = document.createElement('label');
    label.textContent = `数量 (最大: ${maxAmount}): `;
    label.style.display = 'block';
    label.style.marginBottom = '5px';
    inputContainer.appendChild(label);
    
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = maxAmount.toString();
    input.value = '1';
    input.style.padding = '8px';
    input.style.fontSize = '16px';
    input.style.border = '2px solid #000';
    input.style.borderRadius = '4px';
    input.style.width = '100px';
    input.style.textAlign = 'center';
    inputContainer.appendChild(input);
    
    modal.appendChild(inputContainer);
    
    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-around';
    buttonContainer.style.marginTop = '20px';
    
    // 确认按钮
    const confirmButton = new Button('确认', () => {
      const amount = parseInt(input.value);
      if (amount >= 1 && amount <= maxAmount) {
        callback(amount);
        modalOverlay.remove();
      }
    });
    buttonContainer.appendChild(confirmButton.getElement());
    
    // 取消按钮
    const cancelButton = new Button('取消', () => {
      modalOverlay.remove();
    });
    buttonContainer.appendChild(cancelButton.getElement());
    
    modal.appendChild(buttonContainer);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    // 聚焦输入框
    input.focus();
  }

  // 创建事件区域
  private createEventArea(): HTMLElement {
    const eventArea = document.createElement('div');
    eventArea.className = 'pixel-container';
    eventArea.style.width = '250px';
    eventArea.style.height = 'auto';
    eventArea.style.minHeight = '400px';
    eventArea.style.display = 'flex';
    eventArea.style.flexDirection = 'column';
    
    // 事件区域标题
    const eventTitle = document.createElement('h3');
    eventTitle.className = 'pixel-subtitle';
    eventTitle.style.fontSize = '20px';
    eventTitle.textContent = '今日事件';
    eventArea.appendChild(eventTitle);
    
    // 事件列表
    const eventList = document.createElement('div');
    eventList.className = 'event-list';
    eventList.style.flex = '1';
    eventList.style.overflowY = 'auto';
    eventList.style.marginTop = '15px';
    
    // 显示事件
    if (this.events.length === 0) {
      // 没有事件时显示提示
      const noEvents = document.createElement('div');
      noEvents.className = 'event-item event-info';
      noEvents.style.padding = '10px';
      noEvents.style.textAlign = 'center';
      noEvents.textContent = '今天没有特殊事件发生。';
      eventList.appendChild(noEvents);
    } else {
      // 显示当前天数的事件
      const todayEvents = this.events.filter(event => event.day === this.day);
      
      if (todayEvents.length === 0) {
        const noEvents = document.createElement('div');
        noEvents.className = 'event-item event-info';
        noEvents.style.padding = '10px';
        noEvents.style.textAlign = 'center';
        noEvents.textContent = '今天没有特殊事件发生。';
        eventList.appendChild(noEvents);
      } else {
        // 显示事件
        todayEvents.forEach(event => {
          const eventItem = this.createEventItem(event);
          eventList.appendChild(eventItem);
        });
      }
    }
    
    eventArea.appendChild(eventList);
    
    return eventArea;
  }

  // 创建事件项
  private createEventItem(event: GameEventData): HTMLElement {
    const eventItem = document.createElement('div');
    eventItem.className = `event-item event-${event.type} ${event.resolved ? 'resolved' : ''}`;
    eventItem.style.padding = '10px';
    eventItem.style.marginBottom = '10px';
    eventItem.style.borderRadius = '4px';
    eventItem.style.border = '2px solid #000';
    eventItem.style.backgroundColor = '#FFFACD';
    eventItem.style.cursor = event.resolved ? 'default' : 'pointer';
    eventItem.style.opacity = event.resolved ? '0.7' : '1';
    
    // 根据事件类型设置背景色
    switch (event.type) {
      case 'opportunity':
        eventItem.style.backgroundColor = '#98FB98';
        break;
      case 'warning':
        eventItem.style.backgroundColor = '#FFD700';
        break;
      case 'danger':
        eventItem.style.backgroundColor = '#FFB6C1';
        break;
    }
    
    // 事件标题
    const eventTitle = document.createElement('h4');
    eventTitle.style.fontSize = '14px';
    eventTitle.style.fontWeight = 'bold';
    eventTitle.style.marginBottom = '5px';
    eventTitle.textContent = event.title;
    if (event.resolved) {
      eventTitle.textContent += ' (已解决)';
    }
    eventItem.appendChild(eventTitle);
    
    // 事件描述
    const eventDesc = document.createElement('p');
    eventDesc.style.fontSize = '12px';
    eventDesc.textContent = event.description;
    eventItem.appendChild(eventDesc);
    
    // 事件效果（如果有金钱影响）
    const effectText = this.getEventEffectText(event.title);
    if (effectText) {
      const effectEl = document.createElement('p');
      effectEl.style.fontSize = '12px';
      effectEl.style.fontWeight = 'bold';
      effectEl.style.marginTop = '5px';
      effectEl.style.color = effectText.includes('增加') ? '#2E8B57' : '#DC143C';
      effectEl.textContent = effectText;
      eventItem.appendChild(effectEl);
    }
    
    // 添加解决按钮（如果事件未解决）
    if (!event.resolved) {
      const resolveButton = document.createElement('button');
      resolveButton.textContent = '解决';
      resolveButton.style.marginTop = '10px';
      resolveButton.style.padding = '5px 10px';
      resolveButton.style.fontSize = '12px';
      resolveButton.style.border = '2px solid #000';
      resolveButton.style.borderRadius = '4px';
      resolveButton.style.backgroundColor = '#4CAF50';
      resolveButton.style.color = 'white';
      resolveButton.style.cursor = 'pointer';
      resolveButton.onclick = (e) => {
        e.stopPropagation();
        this.onResolveEvent(event.id);
      };
      eventItem.appendChild(resolveButton);
    }
    
    // 点击事件项也可以解决事件
    if (!event.resolved) {
      eventItem.onclick = () => {
        this.onResolveEvent(event.id);
      };
    }
    
    return eventItem;
  }
  
  // 获取事件效果文本
  private getEventEffectText(title: string): string {
    switch (title) {
      case '市场需求上升':
        return '金钱增加：+¥100';
      case '饲料价格波动':
        return '金钱减少：-¥50';
      case '猪群健康问题':
        return '金钱减少：-¥100，饲料减少：-20单位，育肥猪减少：-1头';
      case '政府补贴':
        return '金钱增加：+¥200';
      case '技术培训':
        return '金钱减少：-¥50，育肥猪增加：+1头';
      case '新客户订单':
        return '金钱增加：+¥300';
      case '设备损坏':
        return '金钱减少：-¥150';
      case '饲料丰收':
        return '饲料增加：+30单位，金钱减少：-¥50';
      default:
        return '';
    }
  }

  // 创建状态项
  private createStatItem(name: string, value: string): HTMLElement {
    const item = document.createElement('div');
    item.className = 'stat-item';
    item.innerHTML = `<span>${name}:</span> <span>${value}</span>`;
    return item;
  }

  // 更新状态
  updateState(farmerState: FarmerState, marketState: MarketState, events: GameEventData[] = [], day: number = 1): void {
    this.farmerState = farmerState;
    this.marketState = marketState;
    this.events = events;
    this.day = day;
    
    // 重新渲染页面
    this.element.innerHTML = '';
    this.render();
  }

  // 获取DOM元素
  getElement(): HTMLDivElement {
    return this.element;
  }
}