/* eslint-disable max-len */
import { GIssueMarkerView } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { SIssueSeverity, svg } from 'sprotty';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class IvyIssueMarkerView extends GIssueMarkerView {
  protected getGlspIssueMarkerBackground(severity: SIssueSeverity): VNode {
    switch (severity) {
      case 'warning':
        return <polygon class-sprotty-issue-background={true} points='8 0, 12 12, 0 12' />;
      case 'error':
      case 'info':
        return <circle class-sprotty-issue-background={true} r={this.radius} cx={this.radius} cy={this.radius} />;
    }
  }

  protected get radius(): number {
    return 6;
  }

  protected getGlspIssueMarkerPath(severity: SIssueSeverity): string {
    switch (severity) {
      // paths used here are svg versions of codicons, resized to 12px
      case 'error': // 'codicon-error'
        return 'm 6.6396 0.0052 c 1.3893 0.0868 2.6917 0.7815 3.6469 1.7366 c 1.1288 1.2156 1.7366 2.6917 1.7366 4.4283 c 0 1.3893 -0.521 2.6917 -1.3893 3.8205 c -0.8683 1.042 -2.0839 1.8234 -3.4732 2.0839 C 5.7713 12.3351 4.382 12.1614 3.1664 11.4668 C 1.9508 10.7721 0.9956 9.7302 0.4747 8.4277 C -0.0463 7.1253 -0.1331 5.6492 0.301 4.3467 C 0.7352 2.9575 1.5166 1.8287 2.7322 1.0472 C 3.861 0.2657 5.2503 -0.0816 6.6396 0.0052 Z M 7.0737 11.2063 c 1.1288 -0.2605 2.1707 -0.8683 2.9522 -1.8234 c 0.6946 -0.9551 1.1288 -2.0839 1.042 -3.2995 c 0 -1.3893 -0.521 -2.7786 -1.4761 -3.7337 C 8.7235 1.4814 7.6815 0.9604 6.4659 0.8735 C 5.3371 0.7867 4.1215 1.0472 3.1664 1.7418 C 2.2113 2.4365 1.5166 3.3916 1.1693 4.6072 c -0.3473 1.1288 -0.3473 2.3444 0.1737 3.4732 c 0.521 1.1288 1.3024 1.9971 2.3444 2.6049 c 1.042 0.6078 2.2576 0.7815 3.3864 0.521 z M 6.0318 5.6492 L 8.1157 3.4784 L 8.7235 4.0862 L 6.6396 6.257 L 8.7235 8.4277 L 8.1157 9.0355 L 6.0318 6.8648 L 3.9479 9.0355 L 3.3401 8.4277 L 5.424 6.257 L 3.3401 4.0862 L 3.9479 3.4784 Z';
      case 'warning': // 'codicon-warning'
        return 'M 5.669 0.4598 H 6.4244 L 12.0381 10.9835 L 11.6605 11.6186 H 0.4158 L 0.0381 10.9835 Z M 6.0467 1.5586 L 1.1368 10.7603 H 10.9394 Z M 6.5832 9.9019 V 9.0435 H 5.5102 v 0.8584 z M 5.5102 8.1852 V 4.7517 H 6.5832 v 3.4335 z';
      case 'info': // 'codicon-info'
        return 'M 6.5719 0.013 A 5.9159 5.9159 90 0 1 10.2188 1.7695 A 6.1421 6.1421 90 0 1 10.619 9.9386 A 5.9594 5.9594 90 0 1 3.1546 11.4523 A 6.0899 6.0899 90 0 1 0.4402 8.4074 A 6.1943 6.1943 90 0 1 0.2401 4.3098 A 6.0899 6.0899 90 0 1 2.65 1.0126 A 5.9159 5.9159 90 0 1 6.5719 0.013 Z M 6.9825 11.1913 A 5.1242 5.1242 90 0 0 9.9491 9.3905 A 5.2808 5.2808 90 0 0 9.6011 2.3784 A 5.0633 5.0633 90 0 0 3.1372 1.7347 A 5.2721 5.2721 90 0 0 3.5722 10.6867 A 5.0546 5.0546 90 0 0 6.9825 11.1913 Z M 5.534 4.3359 H 6.6214 V 3.4659 H 5.534 Z M 6.6214 5.2059 V 8.6858 H 5.534 V 5.2059 Z';
    }
  }
}
