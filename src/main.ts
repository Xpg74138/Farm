import { GameController } from './controllers/GameController';

// 初始化游戏
const app = document.getElementById('app');
if (app) {
  const gameController = new GameController(app);
  gameController.init();
}