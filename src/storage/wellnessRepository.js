import { getDatabase } from './database';

export function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function getShortWeekday(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const dt = new Date(year, month - 1, day);
  return dt.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Loads all persisted MindCare state from local SQLite storage.
 */
export async function loadWellnessFromSQLite() {
  const db = await getDatabase();
  const todayKey = getTodayDateKey();

  const dailyRows = await db.getAllAsync(
    `SELECT date_key, steps, active_minutes, screen_time_minutes
     FROM daily_activity_local
     ORDER BY date_key DESC
     LIMIT 7`
  );

  const orderedDays = [...dailyRows].reverse();
  const todayRow = dailyRows.find((r) => r.date_key === todayKey) ||
    dailyRows[0] || {
      steps: 0,
      active_minutes: 0,
      screen_time_minutes: 0,
    };

  const weeklyScreenTime = orderedDays.map((d) => ({
    label: getShortWeekday(d.date_key),
    value: d.screen_time_minutes,
  }));

  const weeklySteps = orderedDays.map((d) => ({
    label: getShortWeekday(d.date_key),
    value: d.steps,
  }));

  const appRows = await db.getAllAsync(
    `SELECT id, package_name, app_name, category, minutes, icon
     FROM app_usage_local
     WHERE date_key = ?
     ORDER BY minutes DESC`,
    [todayKey]
  );

  const appUsage = appRows.map((row) => ({
    id: String(row.id),
    packageName: row.package_name,
    name: row.app_name,
    category: row.category,
    minutes: row.minutes,
    icon: row.icon,
  }));

  const moodRows = await db.getAllAsync(
    `SELECT id, mood_key, label, note, display_time, created_at
     FROM mood_records_local
     ORDER BY created_at DESC
     LIMIT 20`
  );

  const moodLogs = moodRows.map((row) => ({
    id: row.id,
    moodKey: row.mood_key,
    label: row.label,
    note: row.note,
    timestamp: row.display_time,
  }));

  const consentRows = await db.getAllAsync(
    `SELECT key, enabled FROM consent_settings_local`
  );
  const permissions = {
    usageAccess: true,
    healthConnect: true,
    moodCheckIns: true,
    backgroundSync: true,
  };
  for (const row of consentRows) {
    permissions[row.key] = row.enabled === 1;
  }

  const metaRows = await db.getAllAsync(`SELECT key, value FROM app_meta_local`);
  const metaMap = Object.fromEntries(metaRows.map((m) => [m.key, m.value]));

  const queueCountRow = await db.getFirstAsync(
    `SELECT COUNT(*) AS count FROM sync_queue_local WHERE status = 'pending'`
  );

  return {
    steps: todayRow.steps,
    activeMinutes: todayRow.active_minutes,
    screenTimeMinutes: todayRow.screen_time_minutes,
    weeklyScreenTime,
    weeklySteps,
    appUsage,
    moodLogs,
    permissions,
    isCollectionPaused: metaMap.collection_paused === '1',
    lastSyncedAt: metaMap.last_synced_at || 'Not synced yet',
    pendingSyncCount: queueCountRow?.count || 0,
  };
}

/**
 * Persists a new mood entry locally and enqueues it for backend synchronization.
 */
export async function insertMoodRecord({ id, moodKey, label, note, displayTime }) {
  const db = await getDatabase();
  const nowIso = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO mood_records_local
       (id, mood_key, label, note, display_time, created_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [id, moodKey, label, note, displayTime, nowIso]
    );

    await db.runAsync(
      `INSERT INTO sync_queue_local (payload_type, payload_json, status, created_at)
       VALUES (?, ?, 'pending', ?)`,
      [
        'mood_record',
        JSON.stringify({ id, moodKey, label, note, recordedAt: nowIso }),
        nowIso,
      ]
    );
  });
}

/**
 * Persists updated daily step/activity totals and queues an offline sync event.
 */
export async function upsertTodayActivity({
  steps,
  activeMinutes,
  screenTimeMinutes,
}) {
  const db = await getDatabase();
  const todayKey = getTodayDateKey();
  const nowIso = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO daily_activity_local
       (date_key, steps, active_minutes, screen_time_minutes, synced, updated_at)
       VALUES (?, ?, ?, ?, 0, ?)
       ON CONFLICT(date_key) DO UPDATE SET
         steps = excluded.steps,
         active_minutes = excluded.active_minutes,
         screen_time_minutes = excluded.screen_time_minutes,
         synced = 0,
         updated_at = excluded.updated_at`,
      [todayKey, steps, activeMinutes, screenTimeMinutes, nowIso]
    );

    await db.runAsync(
      `INSERT INTO sync_queue_local (payload_type, payload_json, status, created_at)
       VALUES (?, ?, 'pending', ?)`,
      [
        'daily_activity',
        JSON.stringify({
          dateKey: todayKey,
          steps,
          activeMinutes,
          screenTimeMinutes,
        }),
        nowIso,
      ]
    );
  });
}

/**
 * Persists a permission toggle and records it in the sync queue.
 */
export async function persistConsentSetting(key, enabled) {
  const db = await getDatabase();
  const nowIso = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO consent_settings_local (key, enabled, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         enabled = excluded.enabled,
         updated_at = excluded.updated_at`,
      [key, enabled ? 1 : 0, nowIso]
    );

    await db.runAsync(
      `INSERT INTO sync_queue_local (payload_type, payload_json, status, created_at)
       VALUES (?, ?, 'pending', ?)`,
      ['consent_change', JSON.stringify({ key, enabled, updatedAt: nowIso }), nowIso]
    );
  });
}

export async function persistPausedFlag(paused) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO app_meta_local (key, value) VALUES ('collection_paused', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [paused ? '1' : '0']
  );
}

/**
 * Simulates uploading pending offline queue items and marks them synced in SQLite.
 * In Phase 4, this function will send HTTP requests to the Node.js + Express API.
 */
export async function flushOfflineQueue() {
  const db = await getDatabase();
  const pending = await db.getAllAsync(
    `SELECT id, payload_type, payload_json FROM sync_queue_local WHERE status = 'pending'`
  );

  // Simulate network latency for prototype offline sync
  await new Promise((resolve) => setTimeout(resolve, 500));

  const nowLabel = new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
  const syncText = `Today, ${nowLabel}`;

  await db.withTransactionAsync(async () => {
    if (pending.length > 0) {
      await db.runAsync(
        `UPDATE sync_queue_local SET status = 'synced' WHERE status = 'pending'`
      );
      await db.runAsync(
        `UPDATE daily_activity_local SET synced = 1 WHERE synced = 0`
      );
      await db.runAsync(
        `UPDATE mood_records_local SET synced = 1 WHERE synced = 0`
      );
    }

    await db.runAsync(
      `INSERT INTO app_meta_local (key, value) VALUES ('last_synced_at', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [syncText]
    );
  });

  return {
    syncedCount: pending.length,
    lastSyncedAt: syncText,
  };
}
