/* eslint-disable no-unused-vars */
const fs = require('fs');
const utils = require('util');
const readFile = utils.promisify(fs.readFile);var memInfo = {};
var lastCPUInfo = {total:0, active:0, idle:0};
var currentCPUInfo = {total:0, active:0, idle:0};

class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    var getValFromLine = function(line) {
      var match = line.match(/[0-9]+/gi);
      if(match !== null)
        return parseInt(match[0]);
      else
        return null;
    }
    var calculateCPUPercentage = function(oldVals, newVals){
        var totalDiff = newVals.total - oldVals.total;
        var activeDiff = newVals.active - oldVals.active;
        return (activeDiff / totalDiff) * 100;
      };


    lastCPUInfo.active = currentCPUInfo.active;
    lastCPUInfo.idle = currentCPUInfo.idle;
    lastCPUInfo.total = currentCPUInfo.total;
    // currentCPUInfo = {total:0, active:0, idle:0};
    var context={};
    return readFile('/proc/stat', 'utf8').then(data =>  {
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
      context.cpu = currentCPUInfo;
      return readFile('/proc/meminfo', 'utf8').then(data => {
        var lines = data.split('\n');
        memInfo.total = Math.floor(getValFromLine(lines[0]) / 1024);
        memInfo.free = Math.floor(getValFromLine(lines[1]) / 1024);
        memInfo.cached = Math.floor(getValFromLine(lines[3]) / 1024);
        memInfo.used = memInfo.total - memInfo.free;
        memInfo.percentUsed = ((memInfo.used - memInfo.cached) / memInfo.total) * 100;
        context.memory = memInfo;
        return context;

     });
    });
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
