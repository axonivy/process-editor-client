import { CmdCtrl } from './types';

export function cmdCtrl(browserName?: string): CmdCtrl {
  if (browserName) {
    return browserName === 'webkit' ? 'Meta' : 'Control';
  }
  return isMac() ? 'Meta' : 'Control';
}

export function isMac(): boolean {
  return process.platform === 'darwin';
}
