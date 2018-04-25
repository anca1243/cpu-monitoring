# cpu-monitor

> Raspberry Pi CPU Monitoring

## About
I am using d3.js for the graph and  [Feathers](http://feathersjs.com) with socket.io to get the cpu and memory info. This makes the app a lot more lightweight as the front end is not making calls to the backend. Instead of that I am using socket.io to emit cpu and memory info to the frontend from the backend every second.

## Getting Started

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
sudo apt-get install nodejs -y
node -v
# v8.10.0
npm -v
# 5.6.0
```
After this you cna clone and install the application
```
git clone https://anca1243@bitbucket.org/rpicluster/cpu-monitor.git
cd cpu-monitor
npm install
# wait for node packages to install ...
npm start > /dev/null 2>&1 &
```

To run this automatically on startup add the following line to the /etc/rc.local  (before exit 0) 

```
cd /home/<user>/cpu-monitor && npm start > /dev/null 2>&1 &
```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Changelog

__0.1.0__

- Initial release
