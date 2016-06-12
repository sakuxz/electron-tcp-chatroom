const path = require('path');
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const notifier = require('node-notifier');


let mainWindow;
let mainWindow_focus = true;

const {ipcMain} = require('electron');
ipcMain.on('changeWindow', (event, arg) => {
  console.log(arg);  // prints "ping"
  // event.sender.send('changeWindow', 'pong');
  var data = JSON.parse(arg);
  mainWindow.loadURL(`file://${__dirname}/app/${data.type}.html#${data.ip}`)
});
ipcMain.on('notify', (event, arg) => {
  var data = JSON.parse(arg);
  data.icon = path.join(__dirname, 'notify.png');
  if(!mainWindow_focus)
    notifier.notify(data);
});
ipcMain.on('hideMenu', (event, arg) => {
  mainWindow.setMenuBarVisibility(arg);
});

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/index.html`)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
  mainWindow.on('blur', function () {
    mainWindow_focus = false;
  });
  mainWindow.on('focus', function () {
    mainWindow_focus = true;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
