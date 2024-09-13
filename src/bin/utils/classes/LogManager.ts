export class LogManager {
    private logLines: LogLine[];

    public constructor() {
        this.logLines = [];
    }

    public clear(): void {
        this.logLines = [];
    }

    public addLine(str: string, ...args: (string|number|boolean)[]): void {
        this.logLines.push(new LogLine(str, ...args));
    }

    public getOutput(): string {
        let output: string[] = [];
        this.logLines.forEach(logLine => {
            output.push(logLine.getStr());
        });
        return output.join("\n\r");
    }
}

export class LogLine {
    private str: string;

    public constructor(str: string, ...args: (string | number | boolean)[]){
        this.str = LogLine.stringf(str, ...args);
    }

    public getStr() : string {
        return this.str;
    }
    

    static stringf(str: string, ...args: (string|number|boolean)[]): string{
        let splitStr: string[] = str.split("%s");
        let otherSplitStr: string[] = [];
        splitStr.forEach(part => {
            otherSplitStr = [...otherSplitStr, ...part.split("%d")];
        });
        splitStr = otherSplitStr;
        otherSplitStr = [];
        splitStr.forEach(part => {
            otherSplitStr = [...otherSplitStr, ...part.split("%b")];
        });

        str = otherSplitStr[0];
        args.forEach((arg, index) => {
            str += arg + otherSplitStr[index+1];
        });

        return str;
    }
}