import pc from "picocolors";

export const logger = {
  info(msg: string) {
    console.log(pc.cyan("info") + "  " + msg);
  },
  success(msg: string) {
    console.log(pc.green("✓") + " " + msg);
  },
  warn(msg: string) {
    console.log(pc.yellow("warn") + "  " + msg);
  },
  error(msg: string) {
    console.log(pc.red("error") + " " + msg);
  },
  item(msg: string) {
    console.log(pc.dim("  -") + " " + msg);
  },
  break() {
    console.log();
  },
  title(msg: string) {
    console.log(pc.bold(msg));
  },
  dim(msg: string) {
    console.log(pc.dim(msg));
  },
};
