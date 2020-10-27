const { setHeadlessWhen, setWindowSize } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

const sizes = {
  mobile: { width: 375, height: 667 },
  smallTablet: { width: 600, height: 667 },
  tablet: { width: 1023, height: 667 },
  desktop: { width: 1025, height: 667 },
};

const deviceType = process.env.DEVICE_TYPE || "desktop";

const device = sizes[deviceType];

setWindowSize(device.width, device.height);

const browser = process.env.profile || "chromium";

exports.config = {
  tests: "./tests/*_test.js",
  output: "./tests/output",
  helpers: {
    Playwright: {
      url: "http://localhost:8092",
      show: false,
      browser: browser,
      waitForNavigation: "networkidle0",
    },
    ResembleHelper: {
      require: "codeceptjs-resemblehelper",
      screenshotFolder: "./tests/output/",
      baseFolder: "./tests/screenshots/base/",
      diffFolder: "./tests/screenshots/diff/",
    },
  },
  include: {
    I: "./steps_file.js",
  },
  bootstrap: null,
  mocha: {},
  name: "ASC.Web.Client",
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};
