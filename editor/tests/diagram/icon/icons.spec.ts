import { expect } from 'chai';

import { IconStyle, NoIcon, resolveIcon, SvgIcons } from '../../../src/diagram/icon/icons';
import { ActivityTypes, EventStartTypes } from '../../../src/diagram/view-types';

describe('ElementIcons', () => {
  it('element icons are correctly mapped', () => {
    expect(resolveIcon(ActivityTypes.SCRIPT)).to.be.deep.equals({ res: SvgIcons.SCRIPT, style: IconStyle.SI });
    expect(resolveIcon(EventStartTypes.START)).to.be.deep.equals(NoIcon);
  });

  it('show error/signal start icons', () => {
    expect(resolveIcon('std:Message')).to.be.deep.equals({ res: SvgIcons.EMAIL, style: IconStyle.SI });
    expect(resolveIcon('std:Timer')).to.be.deep.equals({ res: SvgIcons.WAIT, style: IconStyle.SI });
    expect(resolveIcon('std:Conditional')).to.be.deep.equals({ res: SvgIcons.NOTE, style: IconStyle.SI });
    expect(resolveIcon('std:Escalation')).to.be.deep.equals({ res: SvgIcons.TRIGGER, style: IconStyle.SI });
    expect(resolveIcon('std:Compensation')).to.be.deep.equals({ res: SvgIcons.ANGLE_DOWN, style: IconStyle.SI });
    expect(resolveIcon('std:Cancel')).to.be.deep.equals({ res: SvgIcons.ALTERNATIVE, style: IconStyle.SI });
  });

  it('external icons are replaced by generic icon', () => {
    expect(resolveIcon('ext:1131930634')).to.be.deep.equals({ res: SvgIcons.DIALOG, style: IconStyle.SI });
  });

  it('resource icons are the same as delivered from the server', () => {
    expect(resolveIcon('res:/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png')).to.be.deep.equals({
      res: 'res:/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png',
      style: IconStyle.IMG
    });
    expect(resolveIcon('http://localhost:8081/designer/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png?ln=xpertivy-1-webContent')).to.be.deep.equals({
      res: 'http://localhost:8081/designer/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png?ln=xpertivy-1-webContent',
      style: IconStyle.IMG
    });
  });
});
