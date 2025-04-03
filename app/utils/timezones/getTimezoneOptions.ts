import moment from "moment-timezone";

export interface IanaTimezone {
  area: string;
  location: string;
}

const RELEVANT_AREAS = [
  "Africa",
  "America",
  "Antarctica",
  "Asia",
  "Atlantic",
  "Australia",
  "Europe",
  "Indian",
  "Pacific",
];

export function getIanaTimezones(): IanaTimezone[] {
  const timezoneNames = moment.tz.names();

  return timezoneNames
    .map((tz) => {
      const parts = tz.split("/");
      if (parts.length < 2) return null;
      const area = parts[0];
      const location = parts.slice(1).join("/");
      return { area, location };
    })
    .filter((tz): tz is IanaTimezone => tz !== null);
}

export function getAreaOptions(timezones: IanaTimezone[]): { label: string; value: string }[] {
  const uniqueAreas = Array.from(new Set(timezones.map((tz) => tz.area)));
  // relevant areas filter
  const filteredAreas = uniqueAreas.filter((area) => RELEVANT_AREAS.includes(area));
  return filteredAreas.map((area) => ({
    label: area,
    value: area,
  }));
}

export function getLocationOptions(
  timezones: IanaTimezone[],
  selectedArea: string
): { label: string; value: string }[] {
  return timezones
    .filter((tz) => tz.area === selectedArea)
    .map((tz) => ({
      label: tz.location,
      value: tz.location,
    }));
}
