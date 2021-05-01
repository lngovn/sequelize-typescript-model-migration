export default {
  warn(msg: string, ...rest: any[]) {
    console.log(`[Warning] ${msg}`, ...rest);
  },
  error(msg: string, ...rest: any[]) {
    console.error(`[Error] ${msg}`, ...rest);
  },
};
