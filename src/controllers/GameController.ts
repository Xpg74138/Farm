import { Router } from './Router';
import { GameState } from '../models/GameState';
import { StartPage } from '../pages/StartPage';
import { FarmerGamePage } from '../pages/FarmerGamePage';
import { SettingsPage } from '../pages/SettingsPage';
import { SaveService } from '../services/SaveService';
import { EventService } from '../services/EventService';

export class GameController {
  private router: Router;
  private gameState: GameState;
  private eventService: EventService;
  private autoSaveInterval: number | null = null;
  
  // 页面实例
  private startPage: StartPage;
  private farmerGamePage: FarmerGamePage;
  private settingsPage: SettingsPage;

  constructor(appElement: HTMLElement) {
    this.router = new Router(appElement);
    this.gameState = new GameState();
    this.eventService = new EventService();
    
    // 初始化页面
    this.startPage = new StartPage(
      () => this.startGame(),
      () => this.loadGame(),
      () => this.router.navigate('settings')
    );
    
    this.farmerGamePage = new FarmerGamePage(
      (amount: number) => this.handleFarmerAction('buyFeed', amount),
      (amount: number) => this.handleFarmerAction('sellPig', amount),
      (amount: number) => this.handleFarmerAction('buyPig', amount),
      () => this.handleFarmerAction('upgradePen'),
      () => this.nextDay(),
      () => this.router.navigate('start')
    );
    
    this.settingsPage = new SettingsPage(
      () => this.router.navigate('start'),
      (gameSpeed, volume) => this.saveSettings(gameSpeed, volume),
      () => this.clearSaves()
    );
  }

  // 初始化游戏
  init(): void {
    // 注册路由
    this.router.registerRoute('start', this.startPage.getElement());
    this.router.registerRoute('farmer-game', this.farmerGamePage.getElement());
    this.router.registerRoute('settings', this.settingsPage.getElement());
    
    // 初始化路由
    this.router.init();
    
    // 加载自动存档
    const autoSave = SaveService.loadAutoSave();
    if (autoSave) {
      this.gameState.loadState(autoSave);
      this.router.navigate('farmer-game');
      this.updateGameUI();
    }
    
    // 设置自动保存（每30秒）
    this.autoSaveInterval = window.setInterval(() => {
      this.autoSave();
    }, 30000);
  }

  // 手动推进到下一天
  nextDay(): void {
    this.gameState.passDay();
    this.updateGameUI();
    this.autoSave();
  }

  // 开始游戏
  private startGame(): void {
    this.router.navigate('farmer-game');
    this.updateGameUI();
  }

  // 加载游戏
  private loadGame(): void {
    const autoSave = SaveService.loadAutoSave();
    if (autoSave) {
      this.gameState.loadState(autoSave);
      this.router.navigate('farmer-game');
      this.updateGameUI();
    }
  }

  // 处理养猪人角色行为
  private handleFarmerAction(action: 'buyFeed' | 'sellPig' | 'buyPig' | 'upgradePen', amount: number = 1): void {
    let success = true;
    
    switch (action) {
      case 'buyFeed':
        success = this.gameState.farmerBuyFeed(amount);
        break;
      case 'sellPig':
        success = this.gameState.farmerSellPig(amount);
        break;
      case 'buyPig':
        success = this.gameState.farmerBuyPig(amount);
        break;
      case 'upgradePen':
        success = this.gameState.farmerUpgradePen();
        break;
    }
    
    if (success) {
      this.updateGameUI();
      this.autoSave();
    } else {
      // 可以添加失败提示
      console.log('Action failed!');
    }
  }

  // 保存设置
  private saveSettings(gameSpeed: number, volume: number): void {
    this.gameState.setGameSpeed(gameSpeed);
    this.gameState.setVolume(volume);
    this.autoSave();
  }

  // 清除存档
  private clearSaves(): void {
    SaveService.clearAllSaves();
    // 重置游戏状态
    this.gameState = new GameState();
    this.updateGameUI();
  }

  // 自动保存
  private autoSave(): void {
    const state = this.gameState.getState();
    SaveService.autoSave(state);
  }

  // 更新游戏UI
  private updateGameUI(): void {
    const state = this.gameState.getState();
    this.farmerGamePage.updateState(state.farmerState, state.marketState, state.events, state.day);
  }



  // 销毁游戏控制器
  destroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    this.eventService.clear();
  }
}