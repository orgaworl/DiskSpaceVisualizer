// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("node:path");

function createMainWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Disk Space Visualizer",
    icon: "/img/icon/logo.ico",
    autoHideMenuBar: true,
    frame:false,
    x: 0,
    y: 0,
    width: 2000,
    minWidth: 800,
    height: 1024,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  require("@electron/remote/main").initialize();
  require("@electron/remote/main").enable(mainWindow.webContents);
  mainWindow.loadFile("src/index.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // mainWindow.webContents.on("did-finish-load", () => {
  //   console.log("----did-finish-load----");
  // });

  
  // mainWindow.webContents.on("dom-ready", () => {
  //   console.log("----dom-ready----");
  // });

  // mainWindow.on("closed", () => {
  //   console.log("----closed----");
  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.


app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) 
      createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.


// app.on("ready", function () {
//   console.log("----ready----");
// });

// app.on("window-all-closed", function () {
//   console.log("----window-all-closed----");
//   if (process.platform !== "darwin") app.quit();
// });

// app.on('before-quit',()=>{
//   console.log('----before-quit----')
// })
// app.on('will-quit',()=>{
//   console.log('----will-quit----')
// })
// app.on('quit',()=>{
//   console.log('----quit----')
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
