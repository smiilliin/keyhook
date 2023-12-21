import koffi from "koffi";
import { VKey } from "./vkey";

type IKey = VKey | string;
interface IShortcut {
  keys: number[];
  callback: () => unknown;
  noRepeat: boolean;
  once?: boolean;
  pressed?: boolean;
}

let shortcuts: IShortcut[] = [];

const lib = koffi.load("user32.dll");
const VkKeyScanA = lib.func("VkKeyScanA", "int16", ["int8"]);
const GetAsyncKeyState = lib.func("GetAsyncKeyState", "int16", ["int32"]);

const registerShortcut = (
  shortcut: IKey[],
  callback: () => unknown,
  noRepeat: boolean = true
) => {
  const keys: number[] = [];
  shortcut.forEach((key) => {
    let keyCode: number;
    if (typeof key == "string") {
      keyCode = VkKeyScanA(key.charCodeAt(0));
    } else {
      keyCode = key as VKey as number;
    }
    keys.push(keyCode);
  });
  shortcuts.push({
    keys: keys,
    callback: callback,
    noRepeat: noRepeat,
  });
};
const hookCallback = () => {
  const checkSuccess = (keys: number[]) => {
    let success: boolean = true;

    if (keys.length == 0) return false;
    keys.forEach((key) => {
      if ((GetAsyncKeyState(key) & 0x8000) == 0) {
        success = false;
      }
    });
    return success;
  };
  shortcuts.forEach((shortcut, i) => {
    if (shortcut.noRepeat && shortcut.pressed) {
      if (!checkSuccess(shortcut.keys)) {
        shortcut.pressed = false;
      }
    } else {
      if (!shortcut.noRepeat || !shortcut.pressed) {
        if (checkSuccess(shortcut.keys)) {
          shortcut.callback();
          shortcut.pressed = true;

          if (shortcut.once) {
            shortcuts.splice(i, 1);
          }
        }
      }
    }
  });
};
const unregisterShortcut = (shortcut: IKey[], noRepeat: boolean = true) => {
  const keys: number[] = [];
  shortcut.forEach((key) => {
    let keyCode: number;
    if (typeof key == "string") {
      keyCode = VkKeyScanA(key.charCodeAt(0));
    } else {
      keyCode = key as VKey as number;
    }
    keys.push(keyCode);
  });
  shortcuts = shortcuts.filter((target) => {
    if (target.keys.length != keys.length) return true;

    let success = true;
    keys.forEach((key) => {
      if (target.keys.indexOf(key) == -1) success = false;
    });
    if (success && target.noRepeat != noRepeat) success = false;

    return success;
  });
};
let hook: number;
const registerHook = (interval: number = 0) => {
  hook = setInterval(hookCallback, interval);
};
const unregisterHook = () => {
  clearInterval(hook);
};
const cleanShortcuts = () => {
  shortcuts = [];
};
const getShortcutsCount = () => shortcuts.length;

export {
  registerHook,
  registerShortcut,
  unregisterShortcut,
  cleanShortcuts,
  getShortcutsCount,
  unregisterHook,
};
export { VKey };
