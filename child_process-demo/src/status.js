const fs = require('fs');
const exec = require('child_process').exec;
const os = require('os');

function isDir(dir) {
  try {
    return fs.lstatSync(dir).isDirectory();
  } catch (error) {
    return false;
  }
}

function checkGitStatus(dir) {
  console.log('CWD:', dir);

  const command = 'git status';

  const options = {
    cwd: dir,
  };

  handler = (error, stdout, stderr) => {
    console.log('error', error);
    console.log('stdout', stdout);
    console.log('stderr', stderr);

    if (error) {
      return setStatus('unknown');
    }

    if (/nothing to commit/.test(stdout)) {
      return setStatus('clean');
    }

    return setStatus('dirty');
  };

  exec(command, options, handler);
}

function formatDir(dir) {
  return /^~/.test(dir) ? os.homedir() + dir.substr(1).trim() : dir.trim();
}

function removeStatus() {
  const el = document.getElementById('status');
  el.classList.remove('unknown', 'clean', 'dirty');
  return el;
}

function setStatus(status) {
  const el = removeStatus();
  el.classList.add(status);
}

let timer;
document.getElementById('input').addEventListener('keyup', (event) => {
  removeStatus();
  clearTimeout(timer);
  timer = setTimeout((_) => {
    const dir = formatDir(event.target.value);
    if (isDir(dir)) {
      checkGitStatus(dir);
    }
  }, 500);
});
