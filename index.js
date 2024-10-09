const { BrowserWindow, getCurrentWindow, dialog } = require("@electron/remote");
const fs = require("fs");
const path = require("path");
let mainWindow = getCurrentWindow();

function getSize(filePath) {
  let totalSize = 0;

  function calculateSize(currentPath) {
    const stats = fs.statSync(currentPath);

    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);

      files.forEach((file) => {
        const fullPath = path.join(currentPath, file);
        console.log(fullPath);
        calculateSize(fullPath);
      });
    }
  }

  calculateSize(filePath);
  return totalSize;
}

window.addEventListener("DOMContentLoaded", () => {
  // 关闭窗口

  // 新建窗口
  // const objBtn = document.getElementById("select-path-button");
  // objBtn.addEventListener("click", () => {
  //   let indexMin = new BrowserWindow({
  //     title: "Disk Space Visualizer",
  //     icon: "/img/icon/logo.ico",
  //     autoHideMenuBar: true,
  //     frame: false,
  //     x: 100,
  //     y: 100,
  //     width: 1000,
  //     minWidth: 800,
  //     height: 600,
  //     show: false,
  //   });
  //   indexMin.loadFile("index.html");
  //   indexMin.on("closed", () => {
  //     indexMin = null;
  //   });

  //   indexMin.once("ready-to-show", () => {
  //     indexMin.show();
  //   });
  // });

  // 菜单栏操作
  const option_minimize = document.getElementById("option-minimize");
  option_minimize.addEventListener("click", () => {
    mainWindow.minimize();
  });

  const option_maximize = document.getElementById("option-maximize");
  option_maximize.addEventListener("click", () => {
    if (!mainWindow.isMaximized()) {
      mainWindow.maximize();
    } else {
      mainWindow.restore();
    }
  });

  const option_close = document.getElementById("option-close");
  option_close.addEventListener("click", () => {
    console.log("option-close");
    mainWindow.close();
  });

  // 选项栏
  const option_file = document.getElementById("option-file");
  option_file.addEventListener("click", () => {
    pathStr = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openDirectory"],
    });
    console.log("Path: %s", pathStr[0]);

    // 计算选择目录下所有文件/目录大小
    var elementWithSize=new Array();
    const files = fs.readdirSync(pathStr[0]);
    files.forEach((file) => {
      const fullPath = path.join(pathStr[0], file);
      const elementSize = getSize(fullPath);
      elementWithSize.push({name:file,size:elementSize});
    });
    elementWithSize.sort((a,b)=>b.size-a.size);
    console.log(elementWithSize);
    

  });

  // 窗口关闭确认
  // window.onbeforeunload = function () {
  //   let close_window = document.getElementsByClassName("close-window")[0];
  //   close_window.style.display = "block";
  //   let yes_option = close_window.getElementsByClassName("close-button")[0];
  //   let no_option = close_window.getElementsByClassName("close-button")[1];

  //   yes_option.addEventListener("click", () => {
  //     mainWindow.destroy();
  //   });

  //   no_option.addEventListener("click", () => {
  //     close_window.style.display = "none";
  //   });
  //   return "你想关闭窗口吗？";
  // };
  // 当窗口关闭时，将窗口的引用设为null
});
