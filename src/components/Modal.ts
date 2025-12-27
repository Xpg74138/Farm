export class Modal {
  private container: HTMLDivElement;
  private overlay: HTMLDivElement;
  private content: HTMLDivElement;
  private _isVisible: boolean = false;

  constructor(title: string, message: string, buttons: Array<{ text: string; onClick: () => void }>) {
    // 创建遮罩层
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    `;

    // 创建内容容器
    this.content = document.createElement('div');
    this.content.className = 'modal-content pixel-container';
    this.content.style.cssText = `
      background-color: #F5DEB3;
      border: 4px solid #000;
      box-shadow: 8px 8px 0 #000;
      padding: 20px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      transform: scale(0.8);
      transition: transform 0.3s ease;
    `;

    // 创建标题
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'pixel-subtitle';
    modalTitle.textContent = title;
    this.content.appendChild(modalTitle);

    // 创建消息
    const modalMessage = document.createElement('p');
    modalMessage.className = 'pixel-text';
    modalMessage.textContent = message;
    this.content.appendChild(modalMessage);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
    `;

    // 添加按钮
    buttons.forEach(button => {
      const btn = document.createElement('button');
      btn.className = 'pixel-btn';
      btn.textContent = button.text;
      btn.addEventListener('click', () => {
        button.onClick();
        this.hide();
      });
      buttonContainer.appendChild(btn);
    });

    this.content.appendChild(buttonContainer);
    this.overlay.appendChild(this.content);
    
    // 创建容器
    this.container = document.createElement('div');
    this.container.appendChild(this.overlay);
  }

  // 获取DOM元素
  getElement(): HTMLDivElement {
    return this.container;
  }

  // 显示弹窗
  show(): void {
    this.overlay.style.opacity = '1';
    this.overlay.style.visibility = 'visible';
    this.content.style.transform = 'scale(1)';
    this._isVisible = true;
  }

  // 隐藏弹窗
  hide(): void {
    this.overlay.style.opacity = '0';
    this.overlay.style.visibility = 'hidden';
    this.content.style.transform = 'scale(0.8)';
    this._isVisible = false;
  }

  // 检查是否可见
  isVisible(): boolean {
    return this._isVisible;
  }

  // 销毁弹窗
  destroy(): void {
    this.container.remove();
  }
}