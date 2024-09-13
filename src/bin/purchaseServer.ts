import { AutocompleteData, NS } from "Bitburner";
import { Constants } from "/lib/Constants";
import { getMaxPurchasableServerSize } from "./maxServerSize";

const FLAGS: Flags = [['size', "2GB"], ['hostname', 'S01'], ['log', false]];



export function autocomplete(data: AutocompleteData, args: string[]){
    data.flags(FLAGS);
    return [...Constants.ServerSizes, 'MAX'];
}

export async function main(ns: NS) {
    const flags = ns.flags(FLAGS);

    let serverSizeStr = flags['size'] as string;
    let serverSize = Constants.ServerSizeStr[serverSizeStr] as number;
    const serverHostname = flags['hostname'] as string;

    ns.tprintf("#".repeat(32));
    ns.tprintf("");

    if(serverSize === undefined && serverSizeStr !== "MAX"){
        ns.tprintf("Provided size '%s' is no valid size!", serverSizeStr);
        return;
    }

    if(serverSizeStr === "MAX"){
        let res = getMaxPurchasableServerSize(ns);
        serverSize = res[0];
    }

    let purchasedHostname = ns.purchaseServer(serverHostname, serverSize);
    if(purchasedHostname == ""){
        ns.tprintf("Failed to purchase server with %s for %s")
    }else{
        ns.tprintf("Successfully purchased Server with size %s and hostname %s", serverSizeStr, serverHostname);
    }

    ns.tprintf("");
}