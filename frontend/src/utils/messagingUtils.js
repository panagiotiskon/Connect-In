export const base64ToDataURL = (base64String, picType) =>
  base64String && picType ? `data:${picType};base64,${base64String}` : '';

export const filterUsersByName = (users, searchTerm) => {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return users;

  const [firstToken, lastToken] = term.split(/\s+/);

  return users.filter((user) => {
    const first = user.firstName?.toLowerCase() ?? '';
    const last = user.lastName?.toLowerCase() ?? '';

    if (lastToken) {
      return first.startsWith(firstToken) && last.startsWith(lastToken);
    }
    return first.startsWith(firstToken) || last.startsWith(firstToken);
  });
};

export const formatMessageTime = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const isRenderableMessage = (message) => !!message?.message;
