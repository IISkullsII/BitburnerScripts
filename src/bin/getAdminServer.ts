import { NS } from "Bitburner";
import { Server } from "./utils/classes/Server";

const fileDir = "serialized/server/";

export async function main(ns: NS) {
    ns.tprintf("#".repeat(32));
    ns.tprintf("");
    ns.tprint("Listing all server names, where you have admin access:");
    ns.tprint("");

    let adminServers = getAdminServers(ns);
    adminServers.forEach(adminServer => {
        ns.tprint(adminServer);
    })
}

export function getAdminServers(ns: NS): string[] {
    let filenames: string[] = ns.ls('home', ".json");

    let adminServers: string[] = [];
    filenames.forEach(filename => {
        let server: Server = Server.RetrieveFromFile(ns, filename, "");
        if(server.hasAdminRights){
            adminServers.push(server.hostname);
        }
    })

    return adminServers;
}