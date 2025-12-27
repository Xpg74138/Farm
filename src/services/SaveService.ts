import type { GameSave, GameState } from '../types/game';

export class SaveService {
  private static readonly SAVE_KEY = 'pigFarmSimulator_saves';
  private static readonly AUTO_SAVE_KEY = 'pigFarmSimulator_autoSave';

  // 获取所有存档
  static getAllSaves(): GameSave[] {
    const savesJson = localStorage.getItem(this.SAVE_KEY);
    return savesJson ? JSON.parse(savesJson) : [];
  }

  // 保存游戏
  static saveGame(name: string, state: GameState): void {
    const saves = this.getAllSaves();
    const save: GameSave = {
      id: Date.now().toString(),
      name,
      timestamp: Date.now(),
      state
    };
    saves.push(save);
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(saves));
  }

  // 自动保存
  static autoSave(state: GameState): void {
    localStorage.setItem(this.AUTO_SAVE_KEY, JSON.stringify(state));
  }

  // 加载自动存档
  static loadAutoSave(): GameState | null {
    const autoSaveJson = localStorage.getItem(this.AUTO_SAVE_KEY);
    return autoSaveJson ? JSON.parse(autoSaveJson) : null;
  }

  // 加载指定存档
  static loadGame(id: string): GameState | null {
    const saves = this.getAllSaves();
    const save = saves.find(s => s.id === id);
    return save ? save.state : null;
  }

  // 删除存档
  static deleteSave(id: string): void {
    const saves = this.getAllSaves();
    const updatedSaves = saves.filter(s => s.id !== id);
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(updatedSaves));
  }

  // 清除所有存档
  static clearAllSaves(): void {
    localStorage.removeItem(this.SAVE_KEY);
    localStorage.removeItem(this.AUTO_SAVE_KEY);
  }
}