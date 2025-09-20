import { MOCK_ACHIEVEMENTS } from "../screens/AchievementsScreen";
import { MOCK_RANKING } from "../screens/RankingScreen";

export const getAchievements = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ACHIEVEMENTS);
    }, 500);
  });
};

export const getRanking = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RANKING);
    }, 500);
  });
};


