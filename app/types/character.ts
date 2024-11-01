export interface Character {
  id: string;
  name: string;
  personality?: string;
  background?: string;
  responses: CharacterResponse[];
}

export interface CharacterResponse {
  id: string;
  content: string;
  timestamp: string;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  characterId?: string;
}
