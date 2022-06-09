import { GIssueMarker, GlspHoverMouseListener } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyHoverMouseListener extends GlspHoverMouseListener {
  protected createIssueMessage(marker: GIssueMarker): string {
    return (
      '<ul>' +
      marker.issues.map(i => '<li><i class="codicon codicon-' + i.severity + '"></i><span>' + i.message + '</span></li>').join('') +
      '</ul>'
    );
  }
}
