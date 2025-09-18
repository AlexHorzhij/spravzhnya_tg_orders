// src/types/telegram.d.ts - створи цей файл для TypeScript типів
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        expand(): void;
        close(): void;
        MainButton: {
          text: string;
          show(): void;
          hide(): void;
          setText(text: string): void;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
        };
        showAlert(message: string, callback?: () => void): void;
      };
    };
  }
}

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

export {};
