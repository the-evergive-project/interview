#!/usr/bin/env bun

import * as fs from 'fs';
import * as os from 'os';
import { exec } from 'child_process';

//------------------------------------------------------------------------

const cpuData = getCpuInfo();
console.log(`CPU: ${cpuData.usage}% (${cpuData.cores} cores)`);

getSystemStats(function(stats) {
  console.log(`Memory: ${(stats.memory.used / 1024 / 1024 / 1024).toFixed(2)}GB`);
  console.log(`Disk: ${stats.disk.used}/${stats.disk.total} (${stats.disk.percentage}%)`);
  console.log(`Uptime: ${Math.floor(stats.uptime / 3600)}h`);
  
  saveConfig({
    name: 'system-monitor',
    lastRun: new Date().toISOString(),
    stats: stats
  });
});


//------------------------------------------------------------------------

function getCpuInfo() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  for (const cpu of cpus) {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  }

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  
  return {
    usage: Math.round((1 - idle / total) * 100),
    cores: cpus.length,
    model: cpus[0].model
  };
}

/**
 * Returns some system stats.
 */
function getSystemStats(callback) {
  const memInfo = {
    total: os.totalmem(),
    free: os.freemem(),
    used: null
  };
  
  memInfo.used = memInfo.total - memInfo.free;
  
  exec('df -h /', (error, stdout, stderr) => {
    const lines = stdout.split('\n');
    const diskData = lines[1].split(/\s+/);
    
    callback({
      memory: memInfo,
      disk: {
        total: diskData[1],
        used: diskData[2],
        available: diskData[3],
        percentage: parseInt(diskData[4])
      },
      uptime: os.uptime(),
      hostname: os.hostname()
    });
  });
}

/**
 * Serialises the provided config into a temporary JSON file.
 */
function saveConfig(config) {
  const configPath = '/tmp/system-config.json';
  
  fs.writeFile(configPath, JSON.stringify(config), (err) => {
    if (err) {
      console.log('Failed to save config');
      return;
    }
    
    fs.readFile(configPath, 'utf8', (readErr, data) => {
      const parsed = JSON.parse(data);
      console.log(`Config saved: ${parsed.name}`);
    });
  });
}
