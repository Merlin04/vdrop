// Number representing July 19, 2021 at 0:00 UTC
// For some reason months start at 0, not 1
export const START_DATE = Date.UTC(2021, 6, 19, 4, 0, 0, 0);

export function getDayNumber() {
    return (Date.now() - START_DATE) / MS_IN_DAY;
}

export const MS_IN_DAY = 86400000;