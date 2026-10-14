import type WavedashSDK from '@wvdsh/sdk-js';

const Wavedash: typeof WavedashSDK | null =
  typeof window !== 'undefined' && 'Wavedash' in window ? window.Wavedash : null;

let leaderboardId: string | undefined;
let leaderboardRequest: Promise<string | null> | undefined;

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

  if (leaderboardId) {
    return leaderboardId;
  }

  if (!leaderboardRequest) {
    leaderboardRequest = Wavedash.getOrCreateLeaderboard(
      'mane-quest',
      Wavedash.LeaderboardSortOrder.ASC,
      Wavedash.LeaderboardDisplayType.TIME_MILLISECONDS
    )
      .then((leaderboard) => {
        if (!leaderboard.success) {
          console.error(leaderboard.message);
          leaderboardRequest = undefined;
          return null;
        }
        leaderboardId = leaderboard.data.id;
        return leaderboardId;
      })
      .catch((error: unknown) => {
        console.error('Failed to get leaderboard ID:', error);
        leaderboardRequest = undefined;
        return null;
      });
  }

  return leaderboardRequest;
};

export const submitCompletionScore = async (elapsedMs: number, deaths: number): Promise<void> => {
  if (!Wavedash) {
    return;
  }

  const id = await getLeaderboardId();
  if (!id) {
    return;
  }

  const result = await Wavedash.uploadLeaderboardScore(id, elapsedMs, true, undefined, {
    deaths,
  });
  if (!result.success) {
    console.error('Failed to submit completion score:', result.message);
  }
};
