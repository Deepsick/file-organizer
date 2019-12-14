const fs = require('fs');
const { join } = require('path');

const [ source, destinationFolder, isDeleteSourceFolder ] = process.argv.slice(2);


const deleteFile = (file) => {
  try {
    fs.unlinkSync(file);
  } catch(err) {
    console.error(err.message);
  }
};

const deleteDir = (folder) => {
  try {
    fs.rmdirSync(folder);
  } catch(err) {
    console.error(err);
  }
};

const copyFile = (filePath, fileName, destination) => {
  try {
    fs.copyFileSync(filePath, join(destination, fileName));
  } catch (err) {
    console.error(err.message);
  }
};

const createFolder = (folder) =>  {
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  } catch(err) {
    console.error(err.message);
  }
}

const readDir = (folder) => {
  try {
    return fs.readdirSync(folder);
  } catch(err) {
    console.error(err.message);
  }
};

const isDirectory = (file) => {
  return fs.statSync(file).isDirectory();
};

const organizeFiles = (folder = 'src', destination = 'build', isDeleted = false) => {
  createFolder(destination);
  const files = readDir(folder);
  for (const file of files) {
    const filePath = join(folder, file);
    if (isDirectory(filePath)) {
      organizeFiles(filePath, destinationFolder, isDeleted);
      continue;
    }

    const letterFolder = file[0].toUpperCase();
    const folderPath = join(destination, letterFolder);
    createFolder(folderPath);
    copyFile(filePath, file, folderPath);
    if (isDeleted) {
      deleteFile(filePath);
    }
  }

  if (isDeleted) {
    deleteDir(folder);
  }
};

organizeFiles(source, destinationFolder, isDeleteSourceFolder);

