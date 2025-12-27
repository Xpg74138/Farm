export class Router {
  private currentRoute: string;
  private routes: Map<string, HTMLElement>;
  private rootElement: HTMLElement;

  constructor(rootElement: HTMLElement) {
    this.currentRoute = 'start';
    this.routes = new Map();
    this.rootElement = rootElement;
    
    // 监听hash变化
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });
  }

  // 注册路由
  registerRoute(route: string, element: HTMLElement): void {
    this.routes.set(route, element);
    element.className = `page ${route === this.currentRoute ? '' : 'hidden'}`;
    this.rootElement.appendChild(element);
  }

  // 导航到路由
  navigate(route: string): void {
    if (this.routes.has(route)) {
      // 隐藏当前页面
      const currentElement = this.routes.get(this.currentRoute);
      if (currentElement) {
        currentElement.classList.add('hidden');
      }
      
      // 显示新页面
      const newElement = this.routes.get(route);
      if (newElement) {
        newElement.classList.remove('hidden');
      }
      
      // 更新当前路由
      this.currentRoute = route;
      window.location.hash = route;
    }
  }

  // 获取当前路由
  getCurrentRoute(): string {
    return this.currentRoute;
  }

  // 处理hash变化
  private handleHashChange(): void {
    const hash = window.location.hash.slice(1) || 'start';
    if (this.routes.has(hash)) {
      this.navigate(hash);
    }
  }

  // 初始化路由
  init(): void {
    const hash = window.location.hash.slice(1) || 'start';
    this.navigate(hash);
  }
}