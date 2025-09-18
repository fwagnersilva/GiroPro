import { stringify } from 'csv-stringify';

export async function generateJourneysCsv(data: any[]): Promise<string> {
  return new Promise((resolve, reject) => {
    stringify(data, (err, result) => {
      if (err) reject(err);
      resolve(result || '');
    });
  });
}

