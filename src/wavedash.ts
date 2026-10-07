import WavedashSDK from '@wvdsh/sdk-js';

// Re-assign to a typed variable that allows null
const Wavedash: typeof WavedashSDK | null = WavedashSDK ? WavedashSDK : null;

export const initWavedash = () => {
  if (Wavedash) {
    Wavedash.init();
  } else {
    console.warn('Wavedash not found');
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
