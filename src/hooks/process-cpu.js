// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const fs = require('fs');
const utils = require('util');
const readFile = utils.promisify(fs.readFile);

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return context => {
    var memInfo = {};
    var currentCPUInfo = {total:0, active:0, idle:0};
    var lastCPUInfo = {total:0, active:0, idle:0};

    function getValFromLine(line){
      var match = line.match(/[0-9]+/gi);
      if(match !== null)
        return parseInt(match[0]);
      else
        return null;
    }
    var calculateCPUPercentage = function(oldVals, newVals){
        var totalDiff = newVals.total - oldVals.total;
        var activeDiff = newVals.active - oldVals.active;
        return Math.ceil((activeDiff / totalDiff) * 100);
      };


    lastCPUInfo.active = currentCPUInfo.active;
    lastCPUInfo.idle = currentCPUInfo.idle;
    lastCPUInfo.total = currentCPUInfo.total;
    context.result={};
    return readFile('/proc/stat', 'utf8',).then(data =>  {
      var lines = data.split('\n');
      var cpuTimes = lines[0].match(/[0-9]+/gi);
      currentCPUInfo.total = 0;
      // We'll count both idle and iowait as idle time
      currentCPUInfo.idle = parseInt(cpuTimes[3]) + parseInt(cpuTimes[4]);
      for (var i = 0; i < cpuTimes.length; i++){
        currentCPUInfo.total += parseInt(cpuTimes[i]);
      }
      currentCPUInfo.active = currentCPUInfo.total - currentCPUInfo.idle
      currentCPUInfo.percentUsed = calculateCPUPercentage(lastCPUInfo, currentCPUInfo);

      context.result.cpu = currentCPUInfo;
      return readFile('/proc/meminfo', 'utf8').then(data => {
        var lines = data.split('\n');
        memInfo.total = Math.floor(getValFromLine(lines[0]) / 1024);
        memInfo.free = Math.floor(getValFromLine(lines[1]) / 1024);
        memInfo.cached = Math.floor(getValFromLine(lines[3]) / 1024);
        memInfo.used = memInfo.total - memInfo.free;
        memInfo.percentUsed = Math.ceil(((memInfo.used - memInfo.cached) / memInfo.total) * 100);
        context.result.memory = memInfo;
        return context;

     });
    });
  };
};
