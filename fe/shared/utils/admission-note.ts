export const getAdmissionNoteLines = (note?: string | null) => {
  if (!note?.trim()) {
    return [];
  }

  return note
    .replace(/\s+(?=(?:Môn chung|Mon chung)\s*:)/gi, '\n')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
};
