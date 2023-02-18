import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

export const getImageBufferFromURL = async (url: string): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    protocol
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Request failed with status code ${response.statusCode}`)
          );

          return;
        }

        const chunks: Buffer[] = [];

        response.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const imageBuffer = Buffer.concat(chunks);

          resolve(imageBuffer);
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};
