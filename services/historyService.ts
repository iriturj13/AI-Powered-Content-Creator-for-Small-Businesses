import { HistoryItem, GeneratedCaption } from '../types';

const STORAGE_KEY = 'socialsip_history';
const MAX_ITEMS = 20;

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

const stripImagesFromHistory = (item: HistoryItem): HistoryItem => {
  if (item.type === 'generate' && item.data.genResults) {
    const newResults = item.data.genResults.map((res: GeneratedCaption) => {
      // Create a copy without imageBase64 to save space if needed
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { imageBase64, ...rest } = res;
      return rest;
    });
    return {
      ...item,
      data: {
        ...item.data,
        genResults: newResults
      }
    };
  }
  return item;
};

export const saveHistoryItem = (item: HistoryItem) => {
  try {
    const history = getHistory();
    // Prepend new item, limit list size
    let newHistory = [item, ...history].slice(0, MAX_ITEMS);
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
        // If QuotaExceededError (likely due to images), try stripping images from the new item
        console.warn("Storage quota exceeded, retrying without images for new item.");
        const smallItem = stripImagesFromHistory(item);
        
        // We might also need to strip images from existing items if it's still too big
        // For now, let's just try saving the text-only version of the current item + existing history
        newHistory = [smallItem, ...history].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    }
  } catch (e) {
    console.error("Failed to save history item", e);
  }
};

export const clearHistory = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error("Failed to clear history", e);
    }
};