import moment from 'moment-timezone';

export function getIanaTimezones(): Array<{ area: string; location: string }> {
  const timezoneNames = moment.tz.names();

  return timezoneNames
    .map((tz) => {
      const parts = tz.split('/');
      if (parts.length < 2) return null;
      const area = parts[0];
      const location = parts.slice(1).join('/');
      return { area, location };
    })
    .filter((tz): tz is { area: string; location: string } => tz !== null);
}
