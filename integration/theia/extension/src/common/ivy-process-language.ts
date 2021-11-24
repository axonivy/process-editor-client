import { GLSPDiagramLanguage } from '@eclipse-glsp/theia-integration';

export const IvyProcessLanguage: GLSPDiagramLanguage = {
  contributionId: 'ivy-glsp-process',
  label: 'Ivy Process',
  diagramType: 'ivy-glsp-process',
  fileExtensions: ['.mod'],
  iconClass: 'fa fa-project-diagram'
};
