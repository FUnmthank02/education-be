export const extractMentionedEmails = (notification: string): string[] => {
  const emailRegex = /@([\w.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const matches = [...notification.matchAll(emailRegex)];
  return matches.map((match) => match[1]);
};
