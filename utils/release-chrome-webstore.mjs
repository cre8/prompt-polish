import chromeWebstoreUpload from 'chrome-webstore-upload';
import archiver from 'archiver';
import fs from 'fs-extra';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// a script to auto upload to chrome webstore, based on https://github.com/fregante/chrome-webstore-upload

const store = chromeWebstoreUpload({
  extensionId: process.env.EXTENSION_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
});

const buildFolder = './dist/prompt-polish/browser';
const zipFilePath = './prompt-polish.zip';

async function zipBuildFolder() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level
    });

    output.on('close', () => resolve());

    archive.on('error', (err) => reject(err));

    archive.pipe(output);

    archive.directory(buildFolder, false);

    archive.finalize();
  });
}

async function uploadToChromeWebStore() {
  try {
    // only zip the build folder if the ZIP env variable is set, because it's already done in the github action
    if(process.env.ZIP) {
      await zipBuildFolder();
    }
    const myZipFile = fs.createReadStream(zipFilePath);
    const token = await store.fetchToken();
    const uploadResponse = await store.uploadExisting(myZipFile, token);
    console.log('Upload response:', uploadResponse);
    await store.publish(target, token).then((publishResponse) =>
      console.log('Publish response:', publishResponse)
    , (error) =>  console.error('Error publishing to Chrome Web Store:', error));
  } catch (error) {
    console.error('Error uploading to Chrome Web Store:', error);
  }
}

uploadToChromeWebStore();
