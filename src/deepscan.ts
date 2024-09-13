import { Server } from "bin/utils/classes/Server";
import { AutocompleteData, NS, IServer } from "Bitburner";

const FLAGS: Flags = [['filename', 'scan_result.json'],['origin', 'home'], ['log', true]];

export function autocomplete(data: AutocompleteData, args: string[]){
    data.flags(FLAGS);
    return [...data.servers];
}

export async function main(ns:NS) {
    const flags = ns.flags(FLAGS);

    const logging = flags['log'] as boolean;
    const filename = flags['filename'] as string;
    const origin = flags['origin'] as string;


    if(logging) ns.tprintf("Scanning recursively from '%s'", origin);
    let scanResult: Server[] = recursiveScan(ns, origin);
    if(logging) ns.tprintf("Scan complete");

    if(logging) ns.tprintf("Writing result to file '%s'", filename);
    scanResult.forEach(result => {
        result.serialize(ns);
    });
    if(logging) ns.tprintf("Writing complete");

    let playerHackingSkill = ns.getPlayer().skills.hacking;

    let serverWorth: any[] = [];
    scanResult.forEach(res => {
        if(res.requiredHackingSkill > playerHackingSkill) return;

        let value = res.moneyMax * res.serverGrowth / res.minDifficulty;
        serverWorth.push({
            'server': res.hostname, 
            'worth': value,
            'minDifficulty': res.minDifficulty,
            'moneyMax': res.moneyMax,
            'growth': res.serverGrowth,
            'requiredHackingSkill': res.requiredHackingSkill,
            'numOpenPortsRequired': res.numOpenPortsRequired
        });
    });

    serverWorth.sort((a,b) => {
        return -(a.worth - b.worth);
    });

    ns.write("server_worth.json", JSON.stringify(serverWorth), "w");
}

function recursiveScan(ns: NS, hostname: string, scannedHostnames: string[] = []): Server[]{

    if(scannedHostnames.indexOf(hostname) >= 0) return [];

    scannedHostnames.push(hostname);

    let server: Server = new Server(ns);
    server.populateByIServer(ns.getServer(hostname));
    let retrievedServer: Server[] = [];
    retrievedServer.push(server);

    ns.scan(hostname).forEach(childHost => {
        let childServer = recursiveScan(ns, childHost, scannedHostnames);
        retrievedServer = [...retrievedServer, ...childServer];
    });

    return retrievedServer;
}