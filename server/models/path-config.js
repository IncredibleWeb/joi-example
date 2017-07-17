import fs from 'fs';
import path from 'path';

export default class {
    constructor(folder, pathConfigs) {
        this.folder = folder;
        this.pathConfigs = {
            '/': {
                view: 'index',
                metaTitle: 'JOI Example',
                title: 'JOI Example',
                remoteScripts: ['/script.js']
            }
        };
    }

    getFileContents(files) {
        let self = this;
        // concat inline styles for document <head>
        let flattenedContents = '';
        files.forEach(function(file) {
            flattenedContents += fs.readFileSync(path.resolve(__dirname) + self.folder + file);
        });

        return flattenedContents;
    }

    getConfig(urlPath) {
        let object = this.pathConfigs[urlPath];

        // check if the path is actually valid.
        if (!object) {
            return null;
        }

        return {
            'data': object
        };
    }
}
