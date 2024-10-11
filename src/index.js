const { BrowserWindow, getCurrentWindow, dialog } = require("@electron/remote");
const fs = require("fs");
const path = require("path");
const d3 = require("d3");

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

function createBlockSet(id){
  // 一个单元
  var path_window = document.createElement("div");
  path_window.style.border = "1px,#d08770,solid";
  path_window.style.float="auto";
  path_window.id = id;
  path_window.style.height = "100%";
  path_window.style.width = "100%";
  // 组成1: title
  var titlePart = document.createElement("div");
  titlePart.innerHTML = id;
  titlePart.style.overflow="hidden";
  titlePart.style.background = "#8fbcbb";
  titlePart.style.height = "5%";
  titlePart.style.width = "100%";
  titlePart.innerHTML="<p class=\"block-title-p\">"+id+"</p>";
  titlePart.style.alignItems = "center";
  path_window.appendChild(titlePart);
  // 组成二: content
  var contentPart = document.createElement("div");
  contentPart.style.background="#88c0d0";
  contentPart.style.height = "95%";
  contentPart.style.width = "100%";
  path_window.appendChild(contentPart);
  return path_window;
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

  // 选项栏: 选择文件夹
  const option_file = document.getElementById("option-file");
  option_file.addEventListener("click", () => {
    pathStr = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openDirectory"],
    });
    console.log("Path: %s", pathStr[0]);

    // 计算选择目录下所有文件/目录大小
    var elementWithSize = new Array();
    var sizeSum = 0;
    const files = fs.readdirSync(pathStr[0]);
    files.forEach((file) => {
      const fullPath = path.join(pathStr[0], file);
      const elementSize = getSize(fullPath);
      sizeSum += elementSize;
      elementWithSize.push({ fileName: file, fileSize: elementSize });
    });
    elementWithSize.sort((a, b) => b.fileSize - a.fileSize);
    console.log(elementWithSize);

    // 选择显示主窗口
    const display_window = document.getElementsByClassName("display-window")[0];
    console.log(display_window.style.width, display_window.style.height);
    display_window.innerHTML = "";

    // 创建路径窗口
    var path_window=createBlockSet(pathStr[0]);
    display_window.appendChild(path_window);

    var insertWindow=display_window.getElementsByTagName('div')[0].getElementsByTagName('div')[1];

    // 创建子窗口
    var curSum = 0;
    for (let file of elementWithSize) {
      // 创建
      var ele = document.createElement("div");
      ele.style.display = "inline-block";
      ele.style.background = "#8fbcbb";
      ele.style.border = "1px,#d08770,solid";

      if (file.fileSize / sizeSum < 0.005) {
        ele.id = "other";
        ele.style.width = "100%";
        ele.style.height = Math.floor((1 - curSum) * 100) + "%";
        ele.innerHTML = "<p class=\"block-title-p\">" + "other" + "</p>";
        insertWindow.appendChild(ele);
        break;
      } else {
        curSum += file.fileSize / sizeSum;
        ele.id = file.fileName;
        ele.innerHTML ="<p class=\"block-title-p\">" + file.fileName + "</p>";

        ele.style.width = 100 + "%";
        ele.style.height = Math.floor((file.fileSize / sizeSum) * 100) + "%";
        insertWindow.appendChild(ele);
      }
    }
    // var curSum = 0;
    // for (var file in elementWithSize) {
    //   // 创建
    //   var ele = document.createElement("div");
    //   ele.style.display = "inline-block";
    //   ele.style.background = "#8fbcbb";
    //   ele.style.border = "1px,#d08770,solid";

    //   if (file.fileSize / sizeSum < 0.1) {
    //     ele.id = "other";
    //     ele.style.width = "100%";
    //     ele.style.height = (1 - curSum) * 100 + "%";
    //     ele.innerHTML = "<p>" + "other" + "</p>";
    //     console.log(ele);
    //     insertWindow.appendChild(ele);
    //     break;
    //   } else {
    //     curSum += file.fileSize / sizeSum;
    //     ele.id = file.fileName;
    //     ele.innerHTML = "<p>" + file.fileName + "</p>";

    //     ele.style.width = 100 + "%";
    //     ele.style.height = (file.fileSize / sizeSum) * 100 + "%";
    //     console.log(ele);
    //     insertWindow.appendChild(ele);
    //   }
    // }
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
