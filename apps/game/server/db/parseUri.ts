export const parseUri = (connectionUri: string) => {
  const regex = new RegExp('user:\\s?(.*?)\\|pass:\\s?(.*?)\\|ip:\\s?(.*?)\\|db:\\s?(.*?)$', 'i');
  const match = connectionUri.match(regex);

  if (!match) {
    throw new Error(`Connection string ${connectionUri} is in the incorrect format.`);
  }

  return {
    user: match[1] || undefined,
    password: match[2] || undefined,
    ip: match[3] || undefined,
    database: match[4] || undefined,
  };
};
