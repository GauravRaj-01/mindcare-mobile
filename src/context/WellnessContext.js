import { createContext, useContext, useMemo, useState } from 'react';

const WellnessContext = createContext(null);

const INITIAL_APP_USAGE = [
  { id: '1', name: 'Study & Docs', category: 'Education', minutes: 84, icon: 'book-outline' },
  { id: '2', name: 'YouTube', category: 'Video', minutes: 62, icon: 'play-circle-outline' },
  { id: '3', name: 'WhatsApp', category: 'Messaging', minutes: 41, icon: 'chatbubble-ellipses-outline' },
  { id: '4', name: 'Instagram', category: 'Social', minutes: 35, icon: 'camera-outline' },
];

const INITIAL_WEEKLY_SCREEN_TIME = [
  { label: 'Mon', value: 210 },
  { label: 'Tue', value: 195 },
  { label: 'Wed', value: 245 },
  { label: 'Thu', value: 180 },
  { label: 'Fri', value: 230 },
  { label: 'Sat', value: 260 },
  { label: 'Sun', value: 222 },
];

const INITIAL_WEEKLY_STEPS = [
  { label: 'Mon', value: 6400 },
  { label: 'Tue', value: 7850 },
  { label: 'Wed', value: 5200 },
  { label: 'Thu', value: 8400 },
  { label: 'Fri', value: 7100 },
  { label: 'Sat', value: 9120 },
  { label: 'Sun', value: 6820 },
];

/**
 * Shared state for student well-being metrics, optional mood check-ins,
 * data-collection consents, and synchronization status.
 * Prototype data here will be replaced by Android SQLite + Kotlin modules + API sync in Phase 3/4.
 */
export function WellnessProvider({ children }) {
  const [steps, setSteps] = useState(6820);
  const [stepGoal] = useState(8000);
  const [activeMinutes, setActiveMinutes] = useState(38);
  const [activeGoal] = useState(45);

  const [screenTimeMinutes] = useState(222); // 3h 42m
  const [screenBudgetMinutes] = useState(270); // 4h 30m gentle reference
  const [appUsage] = useState(INITIAL_APP_USAGE);
  const [weeklyScreenTime] = useState(INITIAL_WEEKLY_SCREEN_TIME);
  const [weeklySteps] = useState(INITIAL_WEEKLY_STEPS);

  const [moodLogs, setMoodLogs] = useState([
    {
      id: 'm1',
      moodKey: 'calm',
      label: 'Calm',
      note: 'Finished morning classes smoothly.',
      timestamp: 'Today, 9:15 AM',
    },
  ]);

  const [permissions, setPermissions] = useState({
    usageAccess: true,
    healthConnect: true,
    moodCheckIns: true,
    backgroundSync: true,
  });
  const [isCollectionPaused, setIsCollectionPaused] = useState(false);

  const [lastSyncedAt, setLastSyncedAt] = useState('Today, 7:10 PM');
  const [isSyncing, setIsSyncing] = useState(false);

  const logMood = ({ moodKey, label, note }) => {
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
  };

  const addStepsSample = (delta = 500) => {
    setSteps((prev) => prev + delta);
    setActiveMinutes((prev) => prev + 4);
  };

  const togglePermission = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const togglePauseAll = () => {
    setIsCollectionPaused((prev) => !prev);
  };

  const revokeAllPermissions = () => {
    setPermissions({
      usageAccess: false,
      healthConnect: false,
      moodCheckIns: false,
      backgroundSync: false,
    });
    setIsCollectionPaused(true);
  };

  const triggerSync = async () => {
    if (isCollectionPaused || isSyncing) return;
    setIsSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      const nowLabel = new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
      setLastSyncedAt(`Today, ${nowLabel}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const value = useMemo(
    () => ({
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
      isSyncing,
      logMood,
      addStepsSample,
      togglePermission,
      togglePauseAll,
      revokeAllPermissions,
      triggerSync,
    }),
    [
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
