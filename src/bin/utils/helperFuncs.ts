import { NS } from "Bitburner";

export function fillString(str: string, length: number, fill: string): string {
    if(str.length >= length) return str;
    let finalStr = str + " ";
    if(finalStr.length >= length) return str;
    finalStr += fill.repeat(length - 1 - finalStr.length);
    return finalStr + " ";
}

export const serverController = {
    getMaxPurchasableServerSize(ns: NS): [number, number] {
        let playerMoney = ns.getServerMoneyAvailable('home');

        let size = 1;
        let cost = 0;
        
        while(ns.getPurchasedServerCost(size * 2) <= playerMoney){
            size *= 2; 
        }

        return [size, ns.getPurchasedServerCost(size)];
    }
}