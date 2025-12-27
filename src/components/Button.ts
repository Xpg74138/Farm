export class Button {
  private element: HTMLButtonElement;

  constructor(text: string, onClick: () => void, className: string = 'pixel-btn') {
    this.element = document.createElement('button');
    this.element.textContent = text;
    this.element.className = className;
    this.element.addEventListener('click', onClick);
  }

  // 获取DOM元素
  getElement(): HTMLButtonElement {
    return this.element;
  }

  // 设置按钮文本
  setText(text: string): void {
    this.element.textContent = text;
  }

  // 禁用按钮
  disable(): void {
    this.element.disabled = true;
    this.element.classList.add('disabled');
  }

  // 启用按钮
  enable(): void {
    this.element.disabled = false;
    this.element.classList.remove('disabled');
  }

  // 销毁按钮（移除事件监听器）
  destroy(): void {
    this.element.remove();
  }
}