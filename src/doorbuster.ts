import { AutocompleteData, NS, IServer } from "Bitburner";
import { BasicSecurity } from "./lib/Helpers";
import { Server } from "bin/utils/classes/Server";

const FLAGS:Flags = [['target', 'file'], ['fileDir', 'serialized/server/'], ['hostname', 'home'], ['log', false]];

export function autocomplete(data: AutocompleteData, args: string[]) {
    data.flags(FLAGS);
    return [...data.servers];
}

export async function main(ns:NS) {
    const flags = ns.flags(FLAGS);

    ns.tprint(flags);

    const target: string = flags['target'] as string;
    const fileDir: string = flags['fileDir'] as string;
    const hostname: string = flags['hostname'] as string;
    const logging: boolean = flags['log'] as boolean;


    if(target !== "file") {
        if(logging) ns.tprintf("Getting AdminRights for '%s'", hostname);
        let server: Server = Server.RetrieveFromFile(ns, hostname + ".json");
        let success = server.getAdminRights(ns);
        if(logging) {
            if(success){
                ns.tprintf("Successfully got AdminRights for '%s'", hostname);
            }else{
                ns.tprintf("Failed to get AdminRights for '%s'", hostname);
            }
        }
    }else{
        if(logging) ns.tprintf("Retrieving filenames of serialized servers as '%s'", fileDir);
        let fileNames: string[] = ns.ls(hostname, '.json');

        let adminRightsCount = 0;
        let totalCount = 0;

        fileNames.forEach(fileName => {
            totalCount++;

            if(logging) ns.tprintf("Getting Server for '%s'", fileName);
            let server: Server = Server.RetrieveFromFile(ns, fileName, "");
            if(logging) ns.tprintf("Retrieved Data for '%s'", server.hostname);
            if(server.hasAdminRights){
                adminRightsCount++;
                return;
            }

            if(logging) ns.tprintf("Getting AdminRights for '%s'", server.hostname);
            let success = server.getAdminRights(ns)
            if(success){
                if(logging) ns.tprintf("Successfully got AdminRights for '%s'", server.hostname);
                adminRightsCount++;
            }else{
                if(logging) ns.tprintf("Failed to get AdminRights for '%s'", server.hostname);
            }
            
            if(logging) ns.tprint("=========");
        });

        ns.tprintf("Checked all Servers: %s / %s", adminRightsCount, totalCount);
    }
}
