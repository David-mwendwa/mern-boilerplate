/**
 * @param {*} name of the user
 * @returns greeting string with user's name based on the time of the day
 */
const logGreeting = (name = 'user') => {
  let hours = new Date().getHours();
  return hours < 12
    ? `Good Morning, ${name}`
    : hours >= 12 && hours <= 17
    ? `Good Afternoon, ${name}`
    : hours >= 17 && hours <= 24
    ? `Good Evening, ${name}`
    : `Hello, ${name}`;
};

export default logGreeting;
