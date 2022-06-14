# Axon Ivy Process Editor Client

This repository contains the Axon Ivy (GLSP-based) process editor.

## Prerequisites

The following libraries/frameworks need to be installed on your system:

- [Node.js](https://nodejs.org/en/) `>= 16.15.0 AND < 17`
- [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0`

The editor is developed using [Visual Studio Code](https://code.visualstudio.com/).
However, it's of course also possible to use another text editor.

---

## Structure

- `editor`: GLSP-based Axon Ivy process editor
- `integration/eclipse`: Eclipse IDE integraion of the process editor
- `integration/theia`: Theia IDE integraion of the process editor
- `integration/vscode`: VS Code extension of the process editor
- `integration/standalone`: Standalone integration of the process editor

---

## Building the process editor

The process editor component has to be built using yarn.
The build is automatically triggered if you open the folder in VS Code or you can run:

```bash
yarn
```

- **Standalone Integration**:
  If you build the process editor also the standalone integraion is build too.

- **Other Integraions (Theia, Eclipse, VS Code)**:
  Run bash command or run task in vscode:

  ```bash
  cd integration/theia (or eclipse, vscode)
  yarn
  ```

  > If the build fails or you want to work with the latest editor source you can link the current source into the integration by run the **Link Integrations** task inside VS Code or by run `configs/link-integrations.sh`

## Running the process editor

The simplest way to start the process editor is by download a [Axon Ivy Designer](https://developer.axonivy.com/download/nightly) and open a process. This will launch the latest prebuild **process editor within the eclipse integration**.

- **Standalone / VS Code Integration**:
  To start the Standalone or VS Code integration you can start the specific launch config directly inside the VS Code.

- **Theia Integration**:
  To start the Theia integration you can run it directly over a VS Code launch config or by run:

  ```bash
  yarn start:browser
  ```

  This will launch the example in the browser on [localhost:3000](http://localhost:3000).

---

## More information

For more information about GLSP, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
