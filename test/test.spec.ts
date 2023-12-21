import assert from "assert";
import {
  cleanShortcuts,
  getShortcutsCount,
  registerHook,
  registerShortcut,
  unregisterHook,
  unregisterShortcut,
  VKey,
} from "../src/main";

describe("test keyhook library(Press ctrl + a)", () => {
  it("register shortcut test", async () => {
    assert(
      await new Promise((resolve) => {
        registerShortcut([VKey.VK_CONTROL, "a"], () => {
          resolve(true);
        });
        registerHook();
      })
    );
    unregisterHook();
    cleanShortcuts();
  }).timeout(10000);
  it("clean shortcuts test", () => {
    registerShortcut([VKey.VK_CONTROL, "c"], () => {}, false);
    registerShortcut([VKey.VK_MENU, "a"], () => {});

    cleanShortcuts();

    assert(getShortcutsCount() == 0);
  });
  it("delete shortcut test", () => {
    registerShortcut([VKey.VK_CONTROL, "c"], () => {}, false);
    registerShortcut([VKey.VK_MENU, "a"], () => {});

    unregisterShortcut([VKey.VK_CONTROL, "c"], false);
    unregisterShortcut([VKey.VK_MENU, "a"], false);

    assert(getShortcutsCount() == 0);
  });
});
