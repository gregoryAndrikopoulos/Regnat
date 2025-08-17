import path from 'path';

export function fixturePath(name) {
  return path.resolve(process.cwd(), 'test', 'fixtures', name);
}
