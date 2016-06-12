const {remote} = require('electron');
const {Menu, MenuItem} = remote;

function setEmptyMenu() {
  const template = [
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function setMenu(func) {
  const template = [
    {
      label: '檔案',
      submenu: [
        {
          label: '存檔',
          accelerator: 'CmdOrCtrl+S',
          click: func[0]
        },
        {
          label: '讀檔',
          accelerator: 'CmdOrCtrl+O',
          click: func[1]
        }
      ]
    },
    {
      label: '關於',
      submenu: [
        {
          label: '程式',
          accelerator: 'CmdOrCtrl+B',
          click(item, focusedWindow) {
            dialog.showMessageBox({
              type: 'info',
              buttons: ["ok"],
              title: "關於此程式",
              message: "electron example"
            });
          }
        }
      ]
    }
  ];


  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
