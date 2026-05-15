export const normalizeMarkdown = (text: string): string => {
  return text.replace(/^(\s*)[•◦▪▫⁃–—]/gm, '$1- ');
};
