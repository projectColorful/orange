/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const cron = require('node-cron');

const { $, pool } = require(`${global.__appRoot}db/pg`);

const isMainCluster = Number(process.env.NODE_APP_INSTANCE) === 0;

// PM2 cluster mode시 중복 스케줄링 방지
if (isMainCluster) {
  console.log(`Server:${process.env.NODE_APP_INSTANCE || 0} Running Cron`);

  let isRunning1 = false;
  cron.schedule('0 0 * * *', async () => {
    // 매일 00:00 마다. 오늘이 21일 아무시간 일때 다음 동작은 22일 00:00
    if (isRunning1) {
      return;
    }

    try {
      isRunning1 = true;

      const sql1 = $`
      SELECT true
      `;
      await pool.query(sql1);
    } catch (e) {
      console.error(e);
    } finally {
      isRunning1 = false;
    }
  });
}

module.exports = cron;
