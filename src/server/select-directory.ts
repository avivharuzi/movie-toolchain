import { dialog } from 'electron';

export const selectDirectory = async (): Promise<string | null> => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }

  return null;
};
