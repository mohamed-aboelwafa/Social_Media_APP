import chalk from 'chalk';
import {createClient} from 'redis';

export const redisClient = createClient({
    url: "redis://127.0.0.1:6379",
    database: 1
});

redisClient.on("error",(err)=>{
    console.log(chalk.red("redis connection failed => "), err);
})

redisClient.on("connect",()=>{
    console.log(chalk.red("redis connected successfully => "));
})


// export const redisConnectionTest = async()=>{
//     redisClient.on("")
// }