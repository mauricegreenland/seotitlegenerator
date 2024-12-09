interface QueryData {
  count: number;
  lastReset: number;
}

const STORAGE_KEY = 'meta_title_generator_queries';
const RESET_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const MAX_QUERIES = 8;

export function getQueryData(): QueryData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { count: 0, lastReset: Date.now() };
  }

  const data: QueryData = JSON.parse(stored);
  
  // Check if reset interval has passed
  if (Date.now() - data.lastReset >= RESET_INTERVAL) {
    const newData = { count: 0, lastReset: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newData;
  }

  return data;
}

export function incrementQueryCount(): void {
  const data = getQueryData();
  const newData = {
    count: data.count + 1,
    lastReset: data.lastReset,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
}

export function getRemainingQueries(): number {
  const { count } = getQueryData();
  return Math.max(0, MAX_QUERIES - count);
}

export function getNextResetTime(): number {
  const { lastReset } = getQueryData();
  return lastReset + RESET_INTERVAL;
}

export function canMakeQuery(): boolean {
  return getRemainingQueries() > 0;
}