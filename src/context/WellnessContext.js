import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  flushOfflineQueue,
  insertMoodRecord,
  loadWellnessFromSQLite,
  persistConsentSetting,
  persistPausedFlag,
  upsertTodayActivity,
} from '../storage/wellnessRepository';

const WellnessContext = createContext(null);

/**
 * Shared state for student well-being metrics, optional mood check-ins,
 * data-collection consents, and SQLite-backed offline synchronization.
 */
export function WellnessProvider({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);

  const [steps, setSteps] = useState(0);
  const [stepGoal] = useState(8000);
  const [activeMinutes, setActiveMinutes] = useState(0);
  const [activeGoal] = useState(45);

  const [screenTimeMinutes, setScreenTimeMinutes] = useState(0);
  const [screenBudgetMinutes] = useState(270);
  const [appUsage, setAppUsage] = useState([]);
  const [weeklyScreenTime, setWeeklyScreenTime] = useState([]);
  const [weeklySteps, setWeeklySteps] = useState([]);

  const [moodLogs, setMoodLogs] = useState([]);

  const [permissions, setPermissions] = useState({
    usageAccess: true,
    healthConnect: true,
    moodCheckIns: true,
    backgroundSync: true,
  });
  const [isCollectionPaused, setIsCollectionPaused] = useState(false);

  const [lastSyncedAt, setLastSyncedAt] = useState('Loading...');
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let active = true;
    loadWellnessFromSQLite()
      .then((data) => {
        if (!active) return;
        setSteps(data.steps);
        setActiveMinutes(data.activeMinutes);
        setScreenTimeMinutes(data.screenTimeMinutes);
        setAppUsage(data.appUsage);
        setWeeklyScreenTime(data.weeklyScreenTime);
        setWeeklySteps(data.weeklySteps);
        setMoodLogs(data.moodLogs);
        setPermissions(data.permissions);
        setIsCollectionPaused(data.isCollectionPaused);
        setLastSyncedAt(data.lastSyncedAt);
        setPendingSyncCount(data.pendingSyncCount);
        setIsHydrated(true);
      })
      .catch((err) => {
        console.warn('SQLite load failed:', err);
        setIsHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const logMood = async ({ moodKey, label, note }) => {
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    const entry = {
      id: String(Date.now()),
      moodKey,
      label,
      note: note.trim(),
      timestamp: `Today, ${nowLabel}`,
    };

    setMoodLogs((prev) => [entry, ...prev]);
    setPendingSyncCount((c) => c + 1);

    await insertMoodRecord({
      id: entry.id,
      moodKey: entry.moodKey,
      label: entry.label,
      note: entry.note,
      displayTime: entry.timestamp,
    });
  };

  const addStepsSample = async (delta = 500) => {
    const nextSteps = steps + delta;
    const nextActive = activeMinutes + 4;
    setSteps(nextSteps);
    setActiveMinutes(nextActive);
    setPendingSyncCount((c) => c + 1);

    await upsertTodayActivity({
      steps: nextSteps,
      activeMinutes: nextActive,
      screenTimeMinutes,
    });
  };

  const togglePermission = async (key) => {
    const nextValue = !permissions[key];
    setPermissions((prev) => ({
      ...prev,
      [key]: nextValue,
    }));
    setPendingSyncCount((c) => c + 1);
    await persistConsentSetting(key, nextValue);
  };

  const togglePauseAll = async () => {
    const nextPaused = !isCollectionPaused;
    setIsCollectionPaused(nextPaused);
    await persistPausedFlag(nextPaused);
  };

  const revokeAllPermissions = async () => {
    const keys = ['usageAccess', 'healthConnect', 'moodCheckIns', 'backgroundSync'];
    setPermissions({
      usageAccess: false,
      healthConnect: false,
      moodCheckIns: false,
      backgroundSync: false,
    });
    setIsCollectionPaused(true);
    setPendingSyncCount((c) => c + keys.length);

    await persistPausedFlag(true);
    for (const key of keys) {
      await persistConsentSetting(key, false);
    }
  };

  const triggerSync = async () => {
    if (isCollectionPaused || isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await flushOfflineQueue();
      setLastSyncedAt(result.lastSyncedAt);
      setPendingSyncCount(0);
    } finally {
      setIsSyncing(false);
    }
  };

  const value = useMemo(
    () => ({
      isHydrated,
      steps,
      stepGoal,
      activeMinutes,
      activeGoal,
      screenTimeMinutes,
      screenBudgetMinutes,
      appUsage,
      weeklyScreenTime,
      weeklySteps,
      moodLogs,
      latestMood: moodLogs[0] || null,
      permissions,
      isCollectionPaused,
      lastSyncedAt,
      pendingSyncCount,
      isSyncing,
      logMood,
      addStepsSample,
      togglePermission,
      togglePauseAll,
      revokeAllPermissions,
      triggerSync,
    }),
    [
      isHydrated,
      steps,
      stepGoal,
      activeMinutes,
      activeGoal,
      screenTimeMinutes,
      screenBudgetMinutes,
      appUsage,
      weeklyScreenTime,
      weeklySteps,
      moodLogs,
      permissions,
      isCollectionPaused,
      lastSyncedAt,
      pendingSyncCount,
      isSyncing,
    ]
  );

  return (
    <WellnessContext.Provider value={value}>
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  const ctx = useContext(WellnessContext);
  if (!ctx) {
    throw new Error('useWellness must be used inside a WellnessProvider');
  }
  return ctx;
}
