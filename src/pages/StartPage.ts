import { Button } from '../components/Button';

export class StartPage {
  private element: HTMLDivElement;
  private onStartGame: () => void;
  private onLoadGame: () => void;
  private onSettings: () => void;

  constructor(onStartGame: () => void, onLoadGame: () => void, onSettings: () => void) {
    this.element = document.createElement('div');
    this.element.className = 'page start-page';
    this.onStartGame = onStartGame;
    this.onLoadGame = onLoadGame;
    this.onSettings = onSettings;
    
    this.render();
  }

  // 渲染页面
  private render(): void {
    // 容器
    const container = document.createElement('div');
    container.className = 'pixel-container';
    
    // 标题
    const title = document.createElement('h1');
    title.className = 'pixel-title';
    title.textContent = '养猪模拟器';
    container.appendChild(title);
    
    // 副标题
    const subtitle = document.createElement('h2');
    subtitle.className = 'pixel-subtitle';
    subtitle.textContent = '一个有趣的文字模拟经营游戏';
    container.appendChild(subtitle);
    
    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.gap = '15px';
    buttonContainer.style.marginTop = '30px';
    
    // 开始游戏按钮
    const startButton = new Button('开始游戏', this.onStartGame);
    buttonContainer.appendChild(startButton.getElement());
    
    // 加载游戏按钮
    const loadButton = new Button('加载游戏', this.onLoadGame);
    buttonContainer.appendChild(loadButton.getElement());
    
    // 设置按钮
    const settingsButton = new Button('设置', this.onSettings);
    buttonContainer.appendChild(settingsButton.getElement());
    
    container.appendChild(buttonContainer);
    this.element.appendChild(container);
  }

  // 获取DOM元素
  getElement(): HTMLDivElement {
    return this.element;
  }
}