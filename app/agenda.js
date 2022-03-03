import {Agenda} from "agenda/es";
// import {initMongo} from "database";

// include jobs

const agenda = new Agenda({
  processEvery: "15 seconds",
  defaultLockLifetime: 2000 // locking job for 2 min
});

// initMongo().then((mongoose) => {
//   agenda.mongo(mongoose.connection.db, "cronjobs");
// });

// subscription termination for the jobs

agenda.on("ready", async () => {
  await agenda.start();
});

agenda.on("error", (error) => {
  console.log("Agenda error", error);
});

async function graceful() {
  await agenda.stop();
  process.exit(0);
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = agenda;
