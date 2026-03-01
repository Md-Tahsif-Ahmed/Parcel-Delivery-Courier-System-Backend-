"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleFilePath = void 0;
//single file
const getSingleFilePath = (files, folderName) => {
    const fileField = files && files[folderName];
    if (fileField && Array.isArray(fileField) && fileField.length > 0) {
        return `/uploads/${folderName}/${fileField[0].filename}`;
    }
    return undefined;
};
exports.getSingleFilePath = getSingleFilePath;
//multiple files
// export const getMultipleFilesPath = (files: any, folderName: IFolderName) => {
//   const folderFiles = files && files[folderName];
//   if (folderFiles) {
//     if (Array.isArray(folderFiles)) {
//       return folderFiles.map((file: any) => `/${folderName}/${file.filename}`);
//     }
//   }
//   return undefined;
// };
