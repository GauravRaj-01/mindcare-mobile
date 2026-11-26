import * as SQLite from 'expo-sqlite';

let dbPromise = null;

function getDateKeyOffset(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

/**
 * Opens the local MindCare SQLite database once and ensures all tables exist.
 * Using a shared singleton promise avoids race conditions when multiple screens mount.
 */
export function getDatabase() {
  if (!dbPromise) {
    dbPromise = initDatabase();
  }
  return dbPromise;
}

async function initDatabase() {
  const db = await SQLite.openDatabaseAsync('mindcare.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS daily_activity_local (
      date_key TEXT PRIMARY KEY,
      steps INTEGER NOT NULL DEFAULT 0,
      active_minutes INTEGER NOT NULL DEFAULT 0,
      screen_time_minutes INTEGER NOT NULL DEFAULT 0,
      synced INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_usage_local (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_key TEXT NOT NULL,
      package_name TEXT NOT NULL,
      app_name TEXT NOT NULL,
      category TEXT NOT NULL,
      minutes INTEGER NOT NULL DEFAULT 0,
      icon TEXT NOT NULL DEFAULT 'apps-outline',
      UNIQUE(date_key, package_name)
    );

    CREATE TABLE IF NOT EXISTS mood_records_local (
      id TEXT PRIMARY KEY,
      mood_key TEXT NOT NULL,
      label TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      display_time TEXT NOT NULL,
      created_at TEXT NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS consent_settings_local (
      key TEXT PRIMARY KEY,
      enabled INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_queue_local (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payload_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_meta_local (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await seedInitialDataIfEmpty(db);
  return db;
}

async function seedInitialDataIfEmpty(db) {
  const existing = await db.getFirstAsync(
    'SELECT COUNT(*) AS count FROM daily_activity_local'
  );

  if (existing && existing.count > 0) {
    return;
  }

  const nowIso = new Date().toISOString();

  // Seed last 7 days of summary data so charts render meaningfully on first launch
  const seedDays = [
    { offset: 6, steps: 6400, active: 32, screen: 210 },
    { offset: 5, steps: 7850, active: 41, screen: 195 },
    { offset: 4, steps: 5200, active: 25, screen: 245 },
    { offset: 3, steps: 8400, active: 46, screen: 180 },
    { offset: 2, steps: 7100, active: 36, screen: 230 },
    { offset: 1, steps: 9120, active: 52, screen: 260 },
    { offset: 0, steps: 6820, active: 38, screen: 222 },
  ];

  await db.withTransactionAsync(async () => {
    for (const day of seedDays) {
      await db.runAsync(
        `INSERT OR IGNORE INTO daily_activity_local
         (date_key, steps, active_minutes, screen_time_minutes, synced, updated_at)
         VALUES (?, ?, ?, ?, 1, ?)`,
        [getDateKeyOffset(day.offset), day.steps, day.active, day.screen, nowIso]
      );
    }

    const todayKey = getDateKeyOffset(0);
    const seedApps = [
      ['com.mindcare.study', 'Study & Docs', 'Education', 84, 'book-outline'],
      ['com.google.android.youtube', 'YouTube', 'Video', 62, 'play-circle-outline'],
      ['com.whatsapp', 'WhatsApp', 'Messaging', 41, 'chatbubble-ellipses-outline'],
      ['com.instagram.android', 'Instagram', 'Social', 35, 'camera-outline'],
    ];

    for (const [pkg, name, category, mins, icon] of seedApps) {
      await db.runAsync(
        `INSERT OR IGNORE INTO app_usage_local
         (date_key, package_name, app_name, category, minutes, icon)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [todayKey, pkg, name, category, mins, icon]
      );
    }

    await db.runAsync(
      `INSERT OR IGNORE INTO mood_records_local
       (id, mood_key, label, note, display_time, created_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [
        'seed-mood-1',
        'calm',
        'Calm',
        'Finished morning classes smoothly.',
        'Today, 9:15 AM',
        nowIso,
      ]
    );

    const defaultConsents = [
      ['usageAccess', 1],
      ['healthConnect', 1],
      ['moodCheckIns', 1],
      ['backgroundSync', 1],
    ];
    for (const [key, enabled] of defaultConsents) {
      await db.runAsync(
        `INSERT OR IGNORE INTO consent_settings_local (key, enabled, updated_at)
         VALUES (?, ?, ?)`,
        [key, enabled, nowIso]
      );
    }

    await db.runAsync(
      `INSERT OR IGNORE INTO app_meta_local (key, value) VALUES (?, ?)`,
      ['last_synced_at', 'Initial sample synced']
    );
    await db.runAsync(
      `INSERT OR IGNORE INTO app_meta_local (key, value) VALUES (?, ?)`,
      ['collection_paused', '0']
    );
  });
}
