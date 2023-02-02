async function performTask(throttledCrawling) {
  const pageNums = [];
  const count = 1000000;
  for (let i = count/100000; i <= count; i++) {
    pageNums.push({
      page: i,
    });
  }
  const allThePromises = pageNums.map((page) => {
    return throttledCrawling(page);
  });
  try {
    await Promise.all(allThePromises);
  } catch (err) {
    console.log(err);
  }
}

module.exports = performTask;
