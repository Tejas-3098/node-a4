import UserDao from "../daos/UserDao";
import mongoose from "mongoose";

const userDao: UserDao = UserDao.getInstance();

const PROTOCOL = "mongodb+srv";
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const HOST = "cluster0.mqkp3.mongodb.net";
const DB_NAME = "myFirstDatabase";
const DB_QUERY = "retryWrites=true&w=majority";
// const connectionString = `${PROTOCOL}://${DB_USERNAME}:${DB_PASSWORD}@${HOST}/${DB_NAME}?${DB_QUERY}`;// connect to the database
const connectionString = `${PROTOCOL}://${DB_USERNAME}:${DB_PASSWORD}@${HOST}/${DB_NAME}?${DB_QUERY}`;// connect to the database
mongoose.connect(connectionString);

export const login = async (u: string, p: string) => {
   try {
    const user = await userDao.findUserByCredentials(u, p);
    if (!user) {
      throw "Unknown user";
    }
    return user;
  } catch (e) {
    return e;
  }
}
  
export const register = async (u: string, p: string, e: string) => {
   try {
    const user = await userDao.findUserByUsername(u);
    if (user) {
      throw 'User already exists';
    }
    const newUser = await userDao.createUser({userName: u, password: p, email: e});
    return newUser;
  } catch (e) {
    return e;
  }
}
  
export const initializeSalaries = (salary: number) => {
  return userDao.findAllUsers()
    .then(users => {
      const sPromises = users.map(user =>
        userDao.updateUserSalaryByUsername(user.username, salary));
      const resultPromise = Promise.all(sPromises);
      resultPromise
        .then(values => {
          return values
        })
    })
}

export const giveRaise = (raise: number) => {
  return userDao.findAllUsers()
    .then(users => {
      const salaryPromises = users.map(user => {
        // @ts-ignore
        const newSalary = user.salary * (1 + raise / 100);
        return userDao.updateUserSalaryByUsername(
          user.username,
          newSalary)
      });
      const resultPromise = Promise.all(salaryPromises);
      resultPromise
        .then(values => {
          return values;
        })
    })
}

// giveRaise(50)
//   .then(results => console.log(results));
//
// initializeSalaries(50000)
//   .then(results => console.log(results));
//
// register('alice008', 'alice234', 'alice234@gmail.com')
//   .then(user => console.log(user))
//
login('alice008', 'alice234')
  .then(user => console.log(user))

// userDao.findAllUsers()
//   .then(users => console.log(users));
