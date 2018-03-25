const fetch = require('node-fetch');

// grab your API key at https://www.codewars.com/users/edit
const API_KEY = '<API_KEY_HERE>';
// date when the course has started
const lecturesStartDate = new Date('2018-02-01T09:40:27Z');

// reminder to myself:
// kata info URL: `https://www.codewars.com/api/v1/code-challenges/${kata}`

(async () => {
  let users = 'zholeg, ayentis, kuznetsoff.vl@gmail.com, Bulavkin, Ivan Pachesnyi, Mixeys, vitman777, sunnymay, Hanzxz, AnatoliiMazur, Tim11, VasDK, rocker-max, AntoninaP, tterehov, MrSnakeshot';

  let stats = users.split(',')
    .map(name => name.trim())
    .map(async user => [user, await countCatas(user, lecturesStartDate)]);
  stats = (await Promise.all(stats))
    .sort( (a, b) => b[1] - a[1])
    .map(stat => console.log(`${stat[0]};${stat[1]}`));

  async function getCatas(user) {
    let page = 0;
    let totalPages = 1;
    let catas = [];
    do {
      let resp = await (await fetch(
        `https://www.codewars.com/api/v1/users/${user}/code-challenges/completed?page=${page}`,
        { headers: {Authorization: API_KEY} }
      )).json();
      catas = catas.concat(resp.data);
      totalPages = resp.totalPages;
    } while (++page < totalPages);
    return catas.filter(cata=>cata);
  }
  async function countCatas(user, sinse) {
    let catas = await getCatas(user);
    return catas.filter(cata => new Date(cata.completedAt).getTime() > sinse.getTime()).length;
  }
})();
