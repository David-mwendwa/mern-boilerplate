/**
 * Greet user
 * @param {*} name name of the user to greet
 * @returns greeting string based on the time of the day @example Good Afternoon, David
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
