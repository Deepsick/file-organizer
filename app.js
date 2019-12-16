const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
const rmdirAsync = promisify(fs.rmdir);
const copyFileAsync = promisify(fs.copyFile);
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

const [ source, destinationFolder, isDeleteSourceFolder ] = process.argv.slice(2);

const deleteFile = async (file) => {
  try {
    await unlinkAsync(file);
  } catch(err) {
    console.error(err.message);
  }
};

const deleteDir = async (folder) => {
  try {
    await rmdirAsync(folder);
  } catch(err) {
    console.error(err);
  }
};

const copyFile = async (filePath, fileName, destination) => {
  try {
    await copyFileAsync(filePath, join(destination, fileName));
  } catch (err) {
    console.error(err.message);
  }
};

const createFolder = async (folder) =>  {
  try {
    if (!await existsAsync(folder)) {
      await mkdirAsync(folder);
    }
  } catch(err) {
    console.error(err.message);
  }
}

const readDir = async (folder) => {
  try {
    return await readdirAsync(folder);
  } catch(err) {
    console.error(err.message);
  }
};

const isDirectory = async (file) => {
  const stats = await statAsync(file);
  return stats.isDirectory();
};

const organizeFiles = async (folder = 'src', destination = 'build', isDeleted = false) => {
  await createFolder(destination);
  const files = await readDir(folder);
  for (const file of files) {
    const filePath = join(folder, file);
    if (await isDirectory(filePath)) {
      await organizeFiles(filePath, destinationFolder, isDeleted);
      continue;
    }

    const letterFolder = file[0].toUpperCase();
    const folderPath = join(destination, letterFolder);
    await createFolder(folderPath);
    await copyFile(filePath, file, folderPath);
    if (isDeleted) {
      await deleteFile(filePath);
    }
  }

  if (isDeleted) {
    await deleteDir(folder);
  }
};

organizeFiles(source, destinationFolder, isDeleteSourceFolder);

