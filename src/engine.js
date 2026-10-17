/** Pure puzzle engine. A state is a vector of color/pattern IDs (0..2).
 * Directed propagation swaps endpoints then cycles the next clockwise node
 * after the destination (including the source). No hidden state or randomness.
 */
export function validateLevel(level) {
  if (level.version !== 1 || !Array.isArray(level.nodes) || level.nodes.length < 3 || level.nodes.length > 7) throw new Error('Invalid nodes/version');
  for (const state of [level.initial, level.target]) {
    if (!Array.isArray(state) || state.length !== level.nodes.length || state.some(c => !Number.isInteger(c) || c < 0 || c > 2)) throw new Error('Invalid state');
  }
  if (!['swap', 'propagate'].includes(level.rule)) throw new Error('Unknown rule');
  if (!Array.isArray(level.edges) || !level.edges.length || level.edges.some(([a,b]) => !Number.isInteger(a) || !Number.isInteger(b) || a === b || a < 0 || b < 0 || a >= level.nodes.length || b >= level.nodes.length)) throw new Error('Invalid edge');
  return true;
}

export function isAllowed(level, a, b) {
  return a !== b && level.edges.some(([x,y]) => (x === a && y === b) || (x === b && y === a));
}

export function transition(level, state, a, b) {
  if (!isAllowed(level, a, b)) return { state: [...state], events: [], valid: false };
  const next = [...state];
  [next[a], next[b]] = [next[b], next[a]];
  const events = [{ type: 'swap', nodes: [a,b] }];
  if (level.rule === 'propagate') {
    const neighbor = (b + 1) % state.length;
    next[neighbor] = (next[neighbor] + 1) % 3;
    events.push({ type: 'cycle', nodes: [neighbor] });
  }
  return { state: next, events, valid: true };
}

export const isSolved = (level, state) => state.every((c,i) => c === level.target[i]);
export const actions = level => level.edges.flatMap(([a,b]) => level.rule === 'propagate' ? [[a,b],[b,a]] : [[a,b]]);

/** Complete BFS over at most 3^7 states. Returns null if unreachable. */
export function solve(level, initial = level.initial) {
  const key = s => s.join('');
  const queue = [{ state: [...initial], path: [] }];
  const seen = new Set([key(initial)]);
  const moves = actions(level);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const { state, path } = queue[cursor];
    if (isSolved(level, state)) return path;
    for (const [a,b] of moves) {
      const next = transition(level, state, a, b).state;
      if (!seen.has(key(next))) {
        seen.add(key(next));
        queue.push({ state: next, path: [...path, [a,b]] });
      }
    }
  }
  return null;
}

export function move(session, a, b) {
  const result = transition(session.level, session.state, a, b);
  if (!result.valid) return session;
  return { ...session, state: result.state, history: [...session.history, [...session.state]], events: result.events };
}
export function undo(session) {
  if (!session.history.length) return session;
  return { ...session, state: [...session.history.at(-1)], history: session.history.slice(0,-1), events: [] };
}
export const createSession = level => ({ level, state: [...level.initial], history: [], events: [] });

export function dailyIndex(date, count) {
  let hash = 2166136261;
  for (const c of date) hash = Math.imul(hash ^ c.charCodeAt(0), 16777619);
  return (hash >>> 0) % count;
}
