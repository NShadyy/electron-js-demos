module.exports = function countdown(tick) {
  let count = 10;

  const timer = setInterval((_) => {
    tick(count--);

    if (count === -1) {
      clearInterval(timer);
    }
  }, 1000);
};
