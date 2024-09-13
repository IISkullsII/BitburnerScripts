import { Hacknet, NodeStats, NS } from "Bitburner";

const costPercentage = 0.125;

const upgradeMaxes = {
    'level': 200,
    'ram': 64,
    'core': 16
}

enum AgentTask {
    purchaseNode = "purchaseNode",
    upgradeLevel = "upgradeLevel",
    upgradeRam = "upgradeRam",
    upgradeCore = "upgradeCore"
}

export async function main(ns:NS) {
    
    let hacknetAPI = ns.hacknet;

    let maxedAllPreviousNodes = false;

    // determine current task on startup
    let numNodes = hacknetAPI.numNodes();

    for(let i = 0; i < numNodes; i++){
        let nodeStats: NodeStats = hacknetAPI.getNodeStats(i);

        if(nodeStats.level < upgradeMaxes.level) {
            await upgradeLevel(ns, hacknetAPI, i);
        }
        if(nodeStats.ram < upgradeMaxes.ram) {
            await upgradeRam(ns, hacknetAPI, i);
        }
        if(nodeStats.cores < upgradeMaxes.core) {
            await upgradeCore(ns, hacknetAPI, i);
        }
    }

    while(true){
        let nodeId = await purchaseNewNode(ns, hacknetAPI);

        await upgradeLevel(ns, hacknetAPI, nodeId);
        await upgradeRam(ns, hacknetAPI, nodeId);
        await upgradeCore(ns, hacknetAPI, nodeId);
    }
    
}

async function purchaseNewNode(ns: NS, hacknetAPI: Hacknet) {
    let nodeId: number = -1;

    while(nodeId < 0){
        let cost = hacknetAPI.getPurchaseNodeCost();

        while(ns.getServerMoneyAvailable('home') * costPercentage < cost){
            await ns.sleep(1000);
        }

        nodeId = hacknetAPI.purchaseNode();
    }
    return nodeId;
}

async function upgradeLevel(ns: NS, hacknetAPI: Hacknet, nodeId: number){
    let currentLevel = hacknetAPI.getNodeStats(nodeId).level;

    while(currentLevel < upgradeMaxes.level){
        let cost = hacknetAPI.getLevelUpgradeCost(nodeId);
        
        while(ns.getServerMoneyAvailable('home') * costPercentage < cost){
            await ns.sleep(1000);
        }

        let res = hacknetAPI.upgradeLevel(nodeId);
        if(res) currentLevel++;
    }
}

async function upgradeRam(ns:NS, hacknetAPI: Hacknet, nodeId: number) {
    let currentRam = hacknetAPI.getNodeStats(nodeId).ram;

    while(currentRam < upgradeMaxes.ram){
        let cost = hacknetAPI.getRamUpgradeCost(nodeId);

        while(ns.getServerMoneyAvailable('home') * costPercentage < cost) {
            await ns.sleep(1000);
        }

        let res = hacknetAPI.upgradeRam(nodeId);
        if(res) currentRam *= 2;
    }
}

async function upgradeCore(ns:NS, hacknetAPI: Hacknet, nodeId: number) {
    let currentCores = hacknetAPI.getNodeStats(nodeId).cores;

    while(currentCores < upgradeMaxes.core){
        let cost = hacknetAPI.getCoreUpgradeCost(nodeId);

        while(ns.getServerMoneyAvailable('home') * costPercentage < cost){
            await ns.sleep(1000);
        }

        let res = hacknetAPI.upgradeCore(nodeId);
        if(res) currentCores++;
    }
}