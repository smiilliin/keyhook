# Keyhook

node global keyboard hooking library for windows

## Usage

### VKey

https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes

### registerShortcut

register a shortcut
| shortcuts | callback | noRepeat(default true) |
| ---| ---| ---|
|keys array(VKey or one char key)| callback | whether to repeat detacting or not|

### unregisterHook

unregister a shortcut
| shortcuts | noRepeat(default true) |
| ---| ---|
|keys array(VKey or one char key)| whether to repeat detacting or not|

### cleanShortcuts

remove all shortcuts

### getShortcutsCount

get shortcuts count

### registerHook

register hooking interval
| interval(default 0) |
| ---|
|setInterval interval|

### unregisterShortcut

unregister hooking interval

Detacting ctrl + s example

```ts
import {
  unregisterHook,
  registerHook,
  registerShortcut,
  VKey,
} from "@smiilliin/keyhook";

registerShortcut([VKey.VK_CONTROL, "s"], () => {
  console.log("ctrl + s detacted!");
  unregisterHook();
});
registerHook();
```

## Build

Install packages

```bash
npm install
```

Build typescript code

```bash
npm run build
```

## Test

Test this package with mocha

```bash
npm run test
```
