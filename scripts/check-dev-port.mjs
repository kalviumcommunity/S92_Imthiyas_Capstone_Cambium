#!/usr/bin/env node
import net from 'node:net';

const port = Number(process.argv[2]);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Provide a valid TCP port to check.');
  process.exit(1);
}

const probe = net.createServer();
probe.once('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing Cambium process before starting another.`);
  } else {
    console.error(`Unable to check port ${port}: ${error.message}`);
  }
  process.exitCode = 1;
});
probe.listen(port, () => {
  probe.close((error) => {
    if (error) {
      console.error(`Unable to release port check for ${port}: ${error.message}`);
      process.exitCode = 1;
    }
  });
});
