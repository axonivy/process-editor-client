import { expect } from 'chai';
import { describe, it } from 'mocha';

import resolveIcon from './icons';

describe('StandardIcons', () => {
  it('standard icons are correctly mapped to fontawesome icons', () => {
    expect(resolveIcon('std:Step')).to.be.equals('fa-cog');
    expect(resolveIcon('std:UserDialog')).to.be.equals('fa-desktop');
    expect(resolveIcon('std:User')).to.be.equals('fa-user');
    expect(resolveIcon('std:WebService')).to.be.equals('fa-globe');
    expect(resolveIcon('std:RestClient')).to.be.equals('fa-exchange-alt');
    expect(resolveIcon('std:Database')).to.be.equals('fa-database');
    expect(resolveIcon('std:Mail')).to.be.equals('fa-envelope');
    expect(resolveIcon('std:Page')).to.be.equals('fa-tv');
    expect(resolveIcon('std:Trigger')).to.be.equals('fa-share-square');
    expect(resolveIcon('std:Program')).to.be.equals('fa-scroll');
    expect(resolveIcon('std:Manual')).to.be.equals('fa-hand-point-right');
    expect(resolveIcon('std:Receive')).to.be.equals('fa-caret-square-down');
    expect(resolveIcon('std:Rule')).to.be.equals('fa-table');
    expect(resolveIcon('std:Send')).to.be.equals('fa-caret-square-up');
    expect(resolveIcon('std:Service')).to.be.equals('fa-cog');
    expect(resolveIcon('std:Script')).to.be.equals('fa-scroll');
  });

  it('external icons are replaced by generic icon', () => {
    expect(resolveIcon('ext:1131930634')).to.be.equals('fa-puzzle-piece');
  });

  it('resource icons are the same as delivered from the server', () => {
    expect(resolveIcon('res:/webContent/layouts/images/ivy_favicon_48.png')).to.be.equals('res:/webContent/layouts/images/ivy_favicon_48.png');
    expect(resolveIcon('http://localhost:8081/designer/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png?ln=xpertivy-1-webContent'))
      .to.be.equals('http://localhost:8081/designer/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png?ln=xpertivy-1-webContent');
  });

  it('no decorator icons are ignored', () => {
    expect(resolveIcon('std:NoDecorator')).to.be.undefined;
  });
});
