/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const Sequelize = require("sequelize");
const corn = require("cron");

const sequelize = new Sequelize("pskuiy_db_development", "nishly", "7882", {
  host: "localhost",
  dialect: "mariadb",
});

console.log("Database Connection established");

const checkHourlyStatus = new corn.CronJob("@hourly", async () => {
  const result = await sequelize.query(
    "UPDATE transactions  SET transactions.status = CASE WHEN transactions.time_checkIn <= NOW() AND transactions.status = 'proccess' then 'cancel' else transactions.status END;",
    {
      type: Sequelize.QueryTypes.UPDATE,
    }
  );
  console.log(
    "update transaction.status job has been triggered on " +
      new Date().toLocaleString() +
      " with affected rows : " +
      result?.[1]
  );
});

const checkRatingAllRooms = new corn.CronJob("@daily", async () => {
  const result = await sequelize.query(
    `SELECT
	        id_room,
          SUM(transactions.rating) AS total_rating,
          COUNT(transactions.id) AS total_data
          FROM
          transactions
          WHERE
          transactions.rating IS NOT NULL AND transactions.status  = 'finished'
          GROUP BY transactions.id_room`,
    {
      type: Sequelize.QueryTypes.SELECT,
    }
  );
  if (result.length === 0) return;
  let affected_rows = 0;
  for (let index = 0; index < result.length; index++) {
    const updatedRooms = await sequelize.query(
      ` UPDATE rooms SET rooms.rating = ${(
        result[index].total_rating / result[index].total_data
      ).toFixed()} WHERE rooms.id = ${result[index].id_room}`,
      {
        type: Sequelize.QueryTypes.UPDATE,
      }
    );
    if (updatedRooms?.[1] !== 0) affected_rows++;
  }
  console.log(
    "update room.rating job has been triggered on " +
      new Date().toLocaleString() +
      " with affected rows : " +
      affected_rows
  );
});

console.log("Corn Job Initiated on " + new Date().toLocaleString());
console.log("Initiating automate hourly update transaction.status job");
checkHourlyStatus.start();

console.log("Initiating automate daily update rooms.rating job");
checkRatingAllRooms.start();
