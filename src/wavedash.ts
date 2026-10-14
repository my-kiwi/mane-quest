import type WavedashSDK from '@wvdsh/sdk-js';

const Wavedash: typeof WavedashSDK | null =
  typeof window !== 'undefined' && 'Wavedash' in window ? window.Wavedash : null;

export const initWavedash = (): boolean => {
  if (!Wavedash) {
    console.info('Wavedash SDK unavailable; platform features are disabled.');
    return false;
  }

  Wavedash.init();
  return true;
};

export const unlockAchievement = (achievementId: string): void => {
  if (Wavedash) {
    Wavedash.setAchievement(achievementId, true);
  }
};

// see https://docs.wavedash.com/sdk/leaderboards#getting-or-creating-a-leaderboard

export const getLeaderboardId = async (): Promise<string | null> => {
  if (!Wavedash) {
    return null;
  }
  const leaderboard = await Wavedash.getOrCreateLeaderboard(
    'mane-quest',
    Wavedash.LeaderboardSortOrder.ASC,
    Wavedash.LeaderboardDisplayType.TIME_MILLISECONDS
  );
  if (!leaderboard.success) {
    console.error(leaderboard.message);
    return null;
  }
  const leaderboardId = leaderboard.data.id;
  return leaderboardId;
};
