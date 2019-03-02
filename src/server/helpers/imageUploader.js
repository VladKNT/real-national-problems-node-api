import fs from 'fs';
import moment from 'moment'

export const uploadImage = ({ stream, filename, mimetype }, photoType) => {
  const type = mimetype.split('/');
  const unicFilename = `filename${moment().unix()}`;
  const uploadDir = `images/${photoType}`;

  const path = `${uploadDir}/${unicFilename}.${type[1]}`;
  console.info(path);

  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
        // delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ path }))
  );
};