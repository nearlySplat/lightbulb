const child_process = require('child_process');
const readline = require("readline")
const getMainProcess = () =>
  child_process.fork(__dirname + '/dist/index.js', {
    silent: true,
  });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let proc = getMainProcess();
  async function pipe() {
    while (!proc || !proc.stdout) {}
    proc.stdout.on('data', data =>
      console.log(`[CHILD] `, data.toString().replace(/\n$/g, ''))
    );
    /**
     * @param {number} code
     * @param {NodeJS.Signals} signal
     */
    function endHandler(code, signal) {
      process.stdout.write(
        `Exited with code ${code?.toLocaleString()}, signal ${
          signal ?? 'none'
        }.\n`
      );
    }
    proc.on('exit', endHandler);
    proc.on('close', endHandler);
    proc.on('message', m => {
      if (m.op === 3) {
        console.log('child is ready to acknowledge pings');
        ready = true;
      }
    });
    proc.on('message', message => {
      if (message.seq === seq && message.op == 2) last = seq;
    });
    proc.send({
      t: 1,
      op: 0,
      m: 'START',
    });
    console.log('[PROCESS_PARENT] Sent message.');
  }
  void pipe();

  let seq = 0;
  let last = seq;
  let missed = 0;
  let ready = false;
  setInterval(() => {
    if (!ready) return;
    proc.send({
      seq: ++seq,
      op: 1,
      m: 'PING',
    });
    setTimeout(() => {
      if (last !== seq) {
        if (++missed > 5) {
          console.log('Killing process since 5 pings were missed.');
          proc.kill('SIGKILL');
          missed = 0;
          ready = false;
          proc = getMainProcess();
          pipe();
        }
      } else missed = 0;
    }, 1000);
  }, 1000);
  (async () => {
    for(;;) {
      const i = readline.readline();
      console.log("Input read: ", i)
      if (i === "rs") {
        proc.kill('SIGTERM')
	missed = 0
	ready = false
	proc = getMainProcess()
	pipe()
      }
    }
  })
})();
