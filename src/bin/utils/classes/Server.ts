import { NS, IServer } from 'Bitburner';
import { BasicSecurity } from '/lib/Helpers';
import { Player } from './Player';

export class Server implements IServer {
    public static serializeDir: string = "./serialized/server/";

    public static RetrieveFromFile(ns: NS, filename: string, serializeDir: string = Server.serializeDir): Server{
        let readFile: string = ns.read(serializeDir + filename);
        let serverJson = JSON.parse(readFile);
        let server: Server = new Server(ns);
        server.populateByJSON(serverJson);
        return server;
    }



    public hostname: string;
    public ip: string;
    public sshPortOpen: boolean;
    public ftpPortOpen: boolean;
    public smtpPortOpen: boolean;
    public httpPortOpen: boolean;
    public sqlPortOpen: boolean;
    public hasAdminRights: boolean;
    public cpuCores: number;
    public isConnectedTo: boolean;
    public ramUsed: number;
    public maxRam: number;
    public organizationName: string;
    public purchasedByPlayer: boolean;
    public backdoorInstalled?: boolean | undefined;
    public baseDifficulty?: number | undefined;
    public hackDifficulty?: number | undefined;
    public minDifficulty: number;
    public moneyAvailable?: number | undefined;
    public moneyMax: number;
    public numOpenPortsRequired?: number | undefined;
    public openPortCount?: number | undefined;
    public requiredHackingSkill: number;
    public serverGrowth: number;

    public constructor(ns: NS){

        this.hostname = "";
        this.ip = "";
        this.sshPortOpen = false;
        this.ftpPortOpen = false;
        this.smtpPortOpen = false;
        this.httpPortOpen = false;
        this.sqlPortOpen = false;
        this.hasAdminRights = false;
        this.cpuCores = 0;
        this.isConnectedTo = false;
        this.ramUsed = 0;
        this.maxRam = 0;
        this.organizationName = "";
        this.purchasedByPlayer = false;
        this.moneyMax = 0;
        this.minDifficulty = 1;
        this.serverGrowth = 1;
        this.requiredHackingSkill = Infinity;
    }
    private populateByJSON(data: object) {
        Object.assign(this, data);
    }

    deserialize(deserializeDir: string): void {
        throw new Error('Method not implemented.');
    }

    public populateByIServer(data: IServer){
        Object.keys(data).forEach(key => {
            this[key] = data[key];
        });
    }

    public serialize(ns: NS, serializeDir: string = Server.serializeDir): void {
        let filePath = serializeDir + this.hostname + ".json";
        let writeServer = JSON.stringify(this);

        try {
            ns.write(filePath, writeServer, "w");
        } catch (error) {
            ns.tprintf("ERROR: %s", error as string);
            return;
        }
    }

    public  Deserialize(ns: NS, serializeDir: string = Server.serializeDir): void {
        let filePath = serializeDir + this.hostname + ".json";

        let fileStream: string;
        let readServer: Server;

        try {
            fileStream = ns.read(filePath);
            readServer = JSON.parse(fileStream);
        } catch (error: any) {
            ns.tprintf("ERROR: %s", error as string)
            return;
        }
        
        Object.keys(readServer).forEach(key => {
            this[key] = readServer[key];
        });
    }

    public getAdminRights(ns: NS): boolean{
        if(this.hasAdminRights) return true;

        let playerStats: Player = ns.getPlayer();
        if(this.requiredHackingSkill === undefined || this.requiredHackingSkill > playerStats.skills.hacking) return false;

        const maxSecurityLevel: number = BasicSecurity.maxSecurityLevel(ns) as number;
        if(this.numOpenPortsRequired === undefined || this.numOpenPortsRequired > maxSecurityLevel) return false;
        
        BasicSecurity.break(ns, this.hostname, maxSecurityLevel);

        this.hasAdminRights = true;
        this.serialize(ns);
        
        return true;
    }
}