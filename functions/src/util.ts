/**
 * Sleeps for x ms.
 * @param ms number of milliseconds to sleep
 * @returns
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Gets the current date without the time
 */
export const getCurrentDate = (): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  return date;
};

/**
 * Format date in the form of yyyy-mm-dd
 * @param date
 * @returns
 */
export const formatDate = (date: Date) => {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${year}-${month}/${day}`;
};

/**
 * Fetch csv.
 */
export const fetchCsv = (url: string, params: { [id: string]: string }) => {
  return fetch(url + new URLSearchParams(params))
    .then((response) => response.text())
    .then((csvText) => {
      const rows = csvText.split("\n");
      const headers = rows[0].split(",");
      const data = [];

      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(",");
        const row: { [id: string]: string } = {};

        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = values[j];
        }

        data.push(row);
      }
      return data;
    })
    .catch((err) => console.log(err));
};
