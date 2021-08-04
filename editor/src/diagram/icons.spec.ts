import { expect } from 'chai';
import { describe, it } from 'mocha';

import StandardIcons from './icons';

describe('StandardIcons', () => {
  it('standard icons are correctly mapped to fontawesome icons', () => {
    expect(StandardIcons['std:Step']).to.be.equals('fa-cog');
    expect(StandardIcons['std:UserDialog']).to.be.equals('fa-desktop');
    expect(StandardIcons['std:User']).to.be.equals('fa-user');
    expect(StandardIcons['std:WebService']).to.be.equals('fa-globe');
    expect(StandardIcons['std:RestClient']).to.be.equals('fa-exchange-alt');
    expect(StandardIcons['std:Database']).to.be.equals('fa-database');
    expect(StandardIcons['std:Mail']).to.be.equals('fa-envelope');
    expect(StandardIcons['std:Page']).to.be.equals('fa-tv');
    expect(StandardIcons['std:Trigger']).to.be.equals('fa-share-square');
    expect(StandardIcons['std:Program']).to.be.equals('fa-scroll');
    expect(StandardIcons['std:Manual']).to.be.equals('fa-hand-point-right');
    expect(StandardIcons['std:Receive']).to.be.equals('fa-caret-square-down');
    expect(StandardIcons['std:Rule']).to.be.equals('fa-table');
    expect(StandardIcons['std:Send']).to.be.equals('fa-caret-square-up');
    expect(StandardIcons['std:Service']).to.be.equals('fa-cog');
    expect(StandardIcons['std:Script']).to.be.equals('fa-scroll');
  });

  it('external icons are ignored', () => {
    expect(StandardIcons['ext:1131930634']).to.be.undefined;
  });

  it('resource icons are ignored', () => {
    expect(StandardIcons['res:/webContent/layouts/images/ivy_favicon_48.png']).to.be.undefined;
  });

  it('no decorator icons are ignored', () => {
    expect(StandardIcons['std:NoDecorator']).to.be.undefined;
  });
});
