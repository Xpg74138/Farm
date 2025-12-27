import type { GameEventData, EventType } from '../types/game';

export class EventManager {
  private eventTemplates: Array<{
    title: string;
    description: string;
    type: EventType;
    probability: number; // 触发概率（0-1）
    effect: {
      money?: number;
      feedStock?: number;
      fatteningPigs?: number;
      readyPigs?: number;
    };
  }>;

  constructor() {
    // 事件模板
    this.eventTemplates = [
      {
        title: '市场需求上升',
        description: '最近猪肉市场需求增加，价格可能会上涨。',
        type: 'opportunity',
        probability: 0.3,
        effect: {
          money: 100
        }
      },
      {
        title: '饲料价格波动',
        description: '由于天气原因，饲料价格出现了波动。',
        type: 'warning',
        probability: 0.25,
        effect: {
          money: -50
        }
      },
      {
        title: '猪群健康问题',
        description: '部分猪出现了健康问题，需要额外的饲料和护理。',
        type: 'danger',
        probability: 0.15,
        effect: {
          money: -100,
          feedStock: -20,
          fatteningPigs: -1
        }
      },
      {
        title: '政府补贴',
        description: '政府推出了养猪补贴政策，你获得了一笔补贴。',
        type: 'opportunity',
        probability: 0.1,
        effect: {
          money: 200
        }
      },
      {
        title: '技术培训',
        description: '参加了养猪技术培训，学到了新的养殖方法。',
        type: 'info',
        probability: 0.2,
        effect: {
          money: -50,
          fatteningPigs: 1
        }
      },
      {
        title: '新客户订单',
        description: '收到了一个大额猪肉订单，可以获得额外收入。',
        type: 'opportunity',
        probability: 0.15,
        effect: {
          money: 300
        }
      },
      {
        title: '设备损坏',
        description: '猪舍的一些设备损坏了，需要维修。',
        type: 'danger',
        probability: 0.1,
        effect: {
          money: -150
        }
      },
      {
        title: '饲料丰收',
        description: '附近的饲料厂丰收，饲料价格下降。',
        type: 'info',
        probability: 0.2,
        effect: {
          feedStock: 30,
          money: -50
        }
      }
    ];
  }

  // 生成随机事件
  generateRandomEvent(day: number): GameEventData | null {
    // 随机选择一个事件模板
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (const template of this.eventTemplates) {
      cumulativeProbability += template.probability;
      if (random <= cumulativeProbability) {
        // 生成事件
        return {
          id: `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: template.title,
          description: template.description,
          type: template.type,
          day,
          resolved: false,
          effect: template.effect
        };
      }
    }
    
    return null;
  }

  // 生成每日事件列表
  generateDailyEvents(day: number, count: number = 2): GameEventData[] {
    const events: GameEventData[] = [];
    
    for (let i = 0; i < count; i++) {
      const event = this.generateRandomEvent(day);
      if (event) {
        events.push(event);
      }
    }
    
    return events;
  }

  // 应用事件效果
  applyEventEffect(event: GameEventData): {
    money: number;
    feedStock: number;
    fatteningPigs: number;
    readyPigs: number;
  } {
    return {
      money: event.effect?.money || 0,
      feedStock: event.effect?.feedStock || 0,
      fatteningPigs: event.effect?.fatteningPigs || 0,
      readyPigs: event.effect?.readyPigs || 0
    };
  }

  // 解决事件
  resolveEvent(event: GameEventData): GameEventData {
    return {
      ...event,
      resolved: true
    };
  }
}
