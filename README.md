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
- `integration/eclipse`: Eclipse IDE integrations of the process editor
- `integration/standalone`: Standalone integration of the process editor

---

## Building the process editor

The process editor component has to be built using yarn.
The build is automatically triggered if you open the folder in VS Code or you can run:

```bash
yarn
```

- **Standalone and Eclipse Integrations**:
  If you build the process editor also standalone and eclipse integrations are built.

- **Eclipse Integration**:
  Run bash command or run task in vscode:

  ```bash
  cd integration/eclipse
  yarn
  ```

## Running the process editor

The simplest way to start the process editor is by download a [Axon Ivy Designer](https://developer.axonivy.com/download/nightly) and open a process. This will launch the latest prebuild **process editor within the eclipse integration**.

- **Standalone**:
  To start the Standalone integration you can start the Launch Standalone config directly inside the VS Code.

---

## More information

For more information about GLSP, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
