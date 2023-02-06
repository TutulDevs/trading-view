// trades
export enum TRADE_STYLE_SETTINGS {
  FRESH = "fresh",
  TRADITIONAL = "traditional",
  COLOR_VISION_DEFICIENCY = "color_vision_deficiency",
}

export enum TRADE_COLOR_PREFERENCE {
  GREEN_UP = 1,
  GREEN_DOWN = 2,
}

export enum TRADE_COLOR_DIRECTIONS {
  UP = "up",
  DOWN = "down",
  DEFAULT = "default",
}

export const TRADE_COLOR_PREFERENCE_TEXT: any = {
  [TRADE_COLOR_PREFERENCE.GREEN_UP]: "Green Up/Red Down",
  [TRADE_COLOR_PREFERENCE.GREEN_DOWN]: "Green Down/Red Up",
};
