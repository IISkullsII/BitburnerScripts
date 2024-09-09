export class ScriptArgs {
    private args: (string|number|boolean)[];

    public constructor(args: (string|number|boolean)[]){
        this.args = args;
    }

    public getArgValue(argName: string): string|number|boolean|undefined{
        let argIndex = this.args.indexOf(argName);
        if(argIndex < 0) return undefined;
        if(argIndex == this.args.length - 1) return undefined;
        return this.args[argIndex + 1];
    }

    public existArg(argName: string): boolean {
        return this.args.indexOf(argName) >= 0;
    }

}