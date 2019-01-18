import AbstractModel from '../lib/AbstractModel';
import Config from '../lib/Config';

const fs = require('fs-extra');
const path = require('path');

export default class Db {
    private readonly prototype: AbstractModel;
    private readonly filePath: string;

    constructor(prototype: AbstractModel) {
        this.prototype = prototype;
        this.filePath = `data/${Config.NODE_NAME}/${prototype.constructor.name}.json`;
    }

    read(prototype: any): any {
        if (!fs.existsSync(this.filePath)) {
            return null;
        }

        const fileContent: string = fs.readFileSync(this.filePath);
        if (fileContent.length === 0) {
            return null;
        }

        return prototype.hydrate(JSON.parse(fileContent));
    }

    write(data: any) {
        fs.ensureDirSync(path.dirname(this.filePath));
        fs.writeFileSync(this.filePath, JSON.stringify(data));
    }
}
