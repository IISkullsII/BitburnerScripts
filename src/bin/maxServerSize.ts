import { AutocompleteData, NS } from "Bitburner";
import { Constants } from "/lib/Constants";

const FLAGS: Flags = [['log', false]];

export function autocomplete(data: AutocompleteData, args: string[]){
    data.flags(FLAGS);
    return [];
}

export async function main(ns:NS) {
    const flags = ns.flags(FLAGS);

    const logging = flags['log'];

    ns.tprintf("#".repeat(32));
    ns.tprintf("");

    let [size, cost] = getMaxPurchasableServerSize(ns);

    let serverSize = Object.keys(Constants.ServerSizeStr).find(key => Constants.ServerSizeStr[key] === size);

    ns.tprintf("Max purchasable Server size is %s for %s", serverSize, ns.formatNumber(cost, 3));
    
    ns.tprintf("");

}

export function getMaxPurchasableServerSize(ns: NS): [number, number] {
    let size = 1;
    let playerMoney = ns.getServerMoneyAvailable('home');

    while(ns.getPurchasedServerCost(size << 1) < playerMoney){
        size = size << 1;
    }

    let cost = ns.getPurchasedServerCost(size);

    return [size, cost];
}