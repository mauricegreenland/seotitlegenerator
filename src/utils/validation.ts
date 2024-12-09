export function validateInput(topic: string): string {
  const trimmed = topic.trim();
  
  if (trimmed.length < 8) {
    throw new Error('Topic must be at least 8 characters long.');
  }

  const words = trimmed.split(/\s+/).filter(word => word.length > 0);
  if (words.length < 2) {
    throw new Error('Topic must contain at least 2 words.');
  }

  return trimmed;
}