export function toDisplayDate(date: string[]): string {
    const year = date[0];
    const month = date[1].toString().length === 1 ? '0' + date[1] : date[1];
    const day = date[2].toString().length === 1 ? '0' + date[2] : date[2];

    return day + '.' + month + '.' + year;
}
