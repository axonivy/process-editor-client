import { GLSPDiagramLanguage } from '@eclipse-glsp/theia-integration';

export const IvyProcessLanguage: GLSPDiagramLanguage = {
  contributionId: 'ivy-glsp-process',
  label: 'Ivy Process',
  diagramType: 'ivy-glsp-process',
  fileExtensions: ['.p.json'],
  iconClass: 'fa fa-project-diagram'
};
