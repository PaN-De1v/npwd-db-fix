export const CONNECTION_STRING = 'mysql_npwm';
interface Map {
  [key: string]: string;
}

/**
 * parse the connection string from the format "user: de1v|pass: MSFKgĐ&g|ip: react.atropol.eu:3306|db: mrdkajedna"
 * @param connectionString - mysql_connection_string value
 */
export function parseSemiColonFormat(connectionString: string): Map {
  const parts = connectionString.split('|');

  if (parts.length === 1) {
    throw new Error(
      `Connection string ${connectionString} is in the incorrect format. Please follow the README.`,
    );
  }

  return parts.reduce<Record<string, string>>((connectionInfo, parameter) => {
    const [key, value] = parameter.split(':').map((part) => part.trim());
    if (value) connectionInfo[key] = value;
    return connectionInfo;
  }, {});
}
