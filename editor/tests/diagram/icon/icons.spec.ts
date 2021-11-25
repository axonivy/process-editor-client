import { expect } from 'chai';
import { describe, it } from 'mocha';

import { IconStyle, NoIcon, resolveIcon } from '../../../src/diagram/icon/icons';

describe('StandardIcons', () => {
  it('standard icons are correctly mapped to fontawesome icons', () => {
    expect(resolveIcon('std:Step')).to.be.deep.equals({ res: 'fa-cog', style: IconStyle.FA });
    expect(resolveIcon('std:UserDialog')).to.be.deep.equals({ res: 'fa-desktop', style: IconStyle.FA });
    expect(resolveIcon('std:User')).to.be.deep.equals({ res: 'fa-user', style: IconStyle.FA });
    expect(resolveIcon('std:WebService')).to.be.deep.equals({ res: 'fa-globe', style: IconStyle.FA });
    expect(resolveIcon('std:RestClient')).to.be.deep.equals({ res: 'fa-exchange-alt', style: IconStyle.FA });
    expect(resolveIcon('std:Database')).to.be.deep.equals({ res: 'fa-database', style: IconStyle.FA });
    expect(resolveIcon('std:Mail')).to.be.deep.equals({ res: 'fa-envelope', style: IconStyle.FA });
    expect(resolveIcon('std:Page')).to.be.deep.equals({ res: 'fa-tv', style: IconStyle.FA });
    expect(resolveIcon('std:Trigger')).to.be.deep.equals({ res: 'fa-share-square', style: IconStyle.FA });
    expect(resolveIcon('std:Program')).to.be.deep.equals({ res: 'fa-scroll', style: IconStyle.FA });
    expect(resolveIcon('std:Manual')).to.be.deep.equals({ res: 'fa-hand-point-right', style: IconStyle.FA });
    expect(resolveIcon('std:Receive')).to.be.deep.equals({ res: 'fa-caret-square-down', style: IconStyle.FA });
    expect(resolveIcon('std:Rule')).to.be.deep.equals({ res: 'fa-table', style: IconStyle.FA });
    expect(resolveIcon('std:Send')).to.be.deep.equals({ res: 'fa-caret-square-up', style: IconStyle.FA });
    expect(resolveIcon('std:Service')).to.be.deep.equals({ res: 'fa-cog', style: IconStyle.FA });
    expect(resolveIcon('std:Script')).to.be.deep.equals({ res: 'fa-scroll', style: IconStyle.FA });
    expect(resolveIcon('std:CallAndWait')).to.be.deep.equals({ res: 'fa-scroll', style: IconStyle.FA });
    expect(resolveIcon('std:SubEnd')).to.be.deep.equals({ res: 'fa-reply', style: IconStyle.FA });
    expect(resolveIcon('std:SubStart')).to.be.deep.equals({ res: 'fa-share', style: IconStyle.FA });
    expect(resolveIcon('std:Init')).to.be.deep.equals({ res: 'fa-arrow-right', style: IconStyle.FA });
    expect(resolveIcon('std:Method')).to.be.deep.equals({ res: 'fa-arrow-circle-right', style: IconStyle.FA });
    expect(resolveIcon('std:Event')).to.be.deep.equals({ res: 'fa-caret-square-right', style: IconStyle.FA });
    expect(resolveIcon('std:Exit')).to.be.deep.equals({ res: 'fa-window-close', style: IconStyle.FA });
    expect(resolveIcon('std:Signal')).to.be.deep.equals({ res: 'M5,0 L10,10 l-10,0 Z', style: IconStyle.SVG });
    expect(resolveIcon('std:Error')).to.be.deep.equals({ res: 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z', style: IconStyle.SVG });
    expect(resolveIcon('std:Alternative')).to.be.deep.equals({ res: 'M2,2 L8,8 M2,8 L8,2', style: IconStyle.SVG });
    expect(resolveIcon('std:Join')).to.be.deep.equals({ res: 'M2,5 L8,5 M5,2 L5,8', style: IconStyle.SVG });
    expect(resolveIcon('std:Split')).to.be.deep.equals({ res: 'M2,5 L8,5 M5,2 L5,8', style: IconStyle.SVG });
    expect(resolveIcon('std:Tasks')).to.be.deep.equals({ res: 'M5,5 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0 M3,5 L7,5 M5,3 L5,7', style: IconStyle.SVG });
  });

  it('external icons are replaced by generic icon', () => {
    expect(resolveIcon('ext:1131930634')).to.be.deep.equals({ res: 'fa-puzzle-piece', style: IconStyle.FA });
  });

  it('resource icons are the same as delivered from the server', () => {
    expect(resolveIcon('res:/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png'))
      .to.be.deep.equals({ res: 'res:/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png', style: IconStyle.IMG });
    expect(resolveIcon('http://localhost:8081/designer/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png?ln=xpertivy-1-webContent'))
      .to.be.deep.equals({ res: 'http://localhost:8081/designer/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png?ln=xpertivy-1-webContent', style: IconStyle.IMG });
  });

  it('no decorator icons are ignored', () => {
    expect(resolveIcon('std:NoDecorator')).to.be.deep.equals(NoIcon);
  });
});
