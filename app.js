const fs = require('fs');
const { join } = require('path');

const [ source, destinationFolder, isDeleteSourceFolder ] = process.argv.slice(2);


const deleteFile = (file) => {
  fs.unlink(file, (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
  });
};

const cleanFolder = (folder) => {
  const files = readDir(folder);
  for (const file of files) {
    const filePath = join(folder, file);
    if (isDirectory(filePath)) {
      cleanFolder(filePath);
      continue;
    }
    deleteFile(filePath);
  }

  deleteDir(folder);
};

const deleteDir = (folder) => {
  fs.rmdir(folder, (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
  });
};

const copyFile = (filePath, fileName, destination) => {
  fs.link(filePath, join(destination, fileName), (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
  });
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
        organizeFiles(filePath, destinationFolder);
        continue;
      }

      const letterFolder = file[0].toUpperCase();
      const folderPath = join(destination, letterFolder);
      createFolder(folderPath);
      copyFile(filePath, file, folderPath);
  }

  if (isDeleted) {
    cleanFolder(source);
  }
};


organizeFiles(source, destinationFolder, isDeleteSourceFolder);

