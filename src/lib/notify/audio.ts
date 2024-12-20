// 添加提醒音效
export const playNotificationSound = async () => {
  const audio = new Audio("assets/audio/notification.mp3"); // 替换为你的音效文件路径
  await audio
    .play()
    .catch((error) => console.error("Error playing sound:", error));
};
