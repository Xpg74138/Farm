import { Button } from '../components/Button';

export class SettingsPage {
  private element: HTMLDivElement;
  private onBack: () => void;
  private onSaveSettings: (gameSpeed: number, volume: number) => void;
  private onClearSaves: () => void;
  private gameSpeed: number = 3;
  private volume: number = 50;

  constructor(
    onBack: () => void, 
    onSaveSettings: (gameSpeed: number, volume: number) => void,
    onClearSaves: () => void
  ) {
    this.element = document.createElement('div');
    this.element.className = 'page settings-page';
    this.onBack = onBack;
    this.onSaveSettings = onSaveSettings;
    this.onClearSaves = onClearSaves;
    
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
    title.textContent = '设置';
    container.appendChild(title);
    
    // 设置容器
    const settingsContainer = document.createElement('div');
    settingsContainer.style.display = 'flex';
    settingsContainer.style.flexDirection = 'column';
    settingsContainer.style.gap = '20px';
    settingsContainer.style.marginTop = '20px';
    
    // 游戏速度设置
    const speedSetting = this.createSliderSetting('游戏速度', 1, 5, this.gameSpeed, (value) => {
      this.gameSpeed = value;
    });
    settingsContainer.appendChild(speedSetting);
    
    // 音量设置
    const volumeSetting = this.createSliderSetting('音量', 0, 100, this.volume, (value) => {
      this.volume = value;
    });
    settingsContainer.appendChild(volumeSetting);
    
    container.appendChild(settingsContainer);
    
    // 存档管理
    const saveManagement = document.createElement('div');
    saveManagement.style.marginTop = '30px';
    
    const saveTitle = document.createElement('h3');
    saveTitle.className = 'pixel-subtitle';
    saveTitle.style.fontSize = '20px';
    saveTitle.textContent = '存档管理';
    saveManagement.appendChild(saveTitle);
    
    const clearSavesButton = new Button('清除所有存档', () => {
      if (confirm('确定要清除所有存档吗？此操作不可恢复！')) {
        this.onClearSaves();
      }
    });
    saveManagement.appendChild(clearSavesButton.getElement());
    
    container.appendChild(saveManagement);
    
    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '15px';
    buttonContainer.style.marginTop = '30px';
    
    // 保存设置按钮
    const saveButton = new Button('保存设置', () => {
      this.onSaveSettings(this.gameSpeed, this.volume);
    });
    buttonContainer.appendChild(saveButton.getElement());
    
    // 返回按钮
    const backButton = new Button('返回', this.onBack);
    buttonContainer.appendChild(backButton.getElement());
    
    container.appendChild(buttonContainer);
    this.element.appendChild(container);
  }

  // 创建滑块设置
  private createSliderSetting(
    name: string, 
    min: number, 
    max: number, 
    initialValue: number, 
    onChange: (value: number) => void
  ): HTMLElement {
    const setting = document.createElement('div');
    setting.style.display = 'flex';
    setting.style.flexDirection = 'column';
    setting.style.gap = '10px';
    
    const label = document.createElement('div');
    label.className = 'pixel-text';
    label.style.fontWeight = 'bold';
    label.textContent = name;
    setting.appendChild(label);
    
    const sliderContainer = document.createElement('div');
    sliderContainer.style.display = 'flex';
    sliderContainer.style.alignItems = 'center';
    sliderContainer.style.gap = '10px';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min.toString();
    slider.max = max.toString();
    slider.value = initialValue.toString();
    slider.className = 'slider';
    slider.style.flex = '1';
    slider.style.height = '10px';
    slider.style.accentColor = '#8B4513';
    slider.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      onChange(value);
      valueDisplay.textContent = value.toString();
    });
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'pixel-text';
    valueDisplay.textContent = initialValue.toString();
    valueDisplay.style.minWidth = '30px';
    valueDisplay.style.textAlign = 'right';
    
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(valueDisplay);
    setting.appendChild(sliderContainer);
    
    return setting;
  }

  // 获取DOM元素
  getElement(): HTMLDivElement {
    return this.element;
  }

  // 设置初始值
  setInitialValues(gameSpeed: number, volume: number): void {
    this.gameSpeed = gameSpeed;
    this.volume = volume;
    
    // 重新渲染页面以更新滑块值
    this.element.innerHTML = '';
    this.render();
  }
}