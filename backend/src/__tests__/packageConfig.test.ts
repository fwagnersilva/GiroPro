
// Additional lockfile checks (PR focus continuation)
// Test framework: Jest + ts-jest (TypeScript).
describe('Additional lockfile checks (PR focus continuation)', () => {
  const backendRoot = findBackendRoot();
  const lockPath = findLockfile(backendRoot);
  const lock = lockPath ? readJsonSafe(lockPath) : null;
  const pkgs = (lock as any)?.packages || {};
  const keys = Object.keys(pkgs);

  it('supertest/superagent are dev-only; mime nested is pinned and exposes CLI', () => {
    if (!lock) return;
    const supertestKey = keys.find(k => /node_modules\/supertest$/.test(k));
    const superagentKey = keys.find(k => /node_modules\/superagent$/.test(k));
    expect(supertestKey).toBeTruthy();
    expect(superagentKey).toBeTruthy();
    if (supertestKey) expect(pkgs[supertestKey].dev).toBe(true);
    if (superagentKey) expect(pkgs[superagentKey].dev).toBe(true);

    const mimeKey = keys.find(k => /node_modules\/superagent\/node_modules\/mime$/.test(k));
    expect(mimeKey).toBeTruthy();
    if (mimeKey) {
      const m = pkgs[mimeKey];
      expect(m.version).toBe('2.6.0');
      expect(m.bin?.mime).toBe('cli.js');
    }
  });

  it('ts-node is pinned with expected license and key deps', () => {
    if (!lock) return;
    const key = keys.find(k => /node_modules\/ts-node$/.test(k));
    expect(key).toBeTruthy();
    if (key) {
      const e = pkgs[key];
      expect(e.version).toBe('10.9.2');
      expect(e.license).toBe('MIT');
      expect(e.dependencies?.yn).toBe('3.1.1');
      expect(e.peerDependencies?.typescript).toBeDefined();
    }
  });

  it('ts-node-dev nested rimraf is deprecated and version-matched', () => {
    if (!lock) return;
    const tsndKey = keys.find(k => /node_modules\/ts-node-dev$/.test(k));
    expect(tsndKey).toBeTruthy();
    if (tsndKey) {
      const tsnd = pkgs[tsndKey];
      expect(tsnd.version).toBe('2.0.0');
      expect(tsnd.engines?.node).toBe('>=0.8.0');
      const rimrafKey = keys.find(k => /node_modules\/ts-node-dev\/node_modules\/rimraf$/.test(k));
      expect(rimrafKey).toBeTruthy();
      if (rimrafKey) {
        const r = pkgs[rimrafKey];
        expect(r.version).toBe('2.7.1');
        expect(String(r.deprecated)).toMatch(/prior to v4/i);
      }
    }
  });

  it('playwright optional fsevents is darwin-only and marked optional', () => {
    if (!lock) return;
    const fseKey = keys.find(k => /node_modules\/playwright\/node_modules\/fsevents$/.test(k));
    expect(fseKey).toBeTruthy();
    if (fseKey) {
      const fse = pkgs[fseKey];
      expect(fse.version).toBe('2.3.2');
      expect(fse.optional).toBe(true);
      expect(Array.isArray(fse.os)).toBe(true);
      expect(fse.os).toContain('darwin');
    }
  });

  it('ts-jest has yargs-parser dependency range and nested type-fest engine', () => {
    if (!lock) return;
    const tsJestKey = keys.find(k => /node_modules\/ts-jest$/.test(k));
    expect(tsJestKey).toBeTruthy();
    if (tsJestKey) {
      const e = pkgs[tsJestKey];
      expect(e.dependencies?.['yargs-parser']).toMatch(/^\^?21\.1\.1$/);
    }
    const tfKey = keys.find(k => /node_modules\/ts-jest\/node_modules\/type-fest$/.test(k));
    expect(tfKey).toBeTruthy();
    if (tfKey) {
      const tf = pkgs[tfKey];
      expect(tf.version).toBe('4.41.0');
      expect(tf.engines?.node).toBe('>=16');
    }
  });
});