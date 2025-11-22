
export enum AppStep {
  UPLOAD_USER = 0,
  CONFIGURATION = 1,
  PROCESSING = 2,
  RESULT = 3,
}

export enum EditMode {
  CLOTHING = 'clothing',
  HAIR = 'hair',
}

export enum InputType {
  IMAGE = 'image',
  TEXT = 'text',
  PRESET = 'preset',
}

export interface ProcessConfig {
  userImage: string; // Base64
  mode: EditMode;
  inputType: InputType;
  referenceImage?: string; // Base64 for clothes/hair
  textDescription?: string;
  presetId?: string;
}

export interface PresetItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  category: 'hair' | 'clothing';
  gender: 'male' | 'female' | 'unisex';
}
