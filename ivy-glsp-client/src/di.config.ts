import '../css/diagram.css';

import {
    boundsModule,
    buttonModule,
    configureModelElement,
    ConsoleLogger,
    defaultGLSPModule,
    defaultModule,
    DeleteElementContextMenuItemProvider,
    edgeLayoutModule,
    expandModule,
    exportModule,
    fadeModule,
    glspContextMenuModule,
    GLSPGraph,
    glspHoverModule,
    glspMouseToolModule,
    glspSelectModule,
    glspServerCopyPasteModule,
    GridSnapper,
    HtmlRoot,
    HtmlRootView,
    layoutCommandsModule,
    LogLevel,
    modelHintsModule,
    modelSourceModule,
    overrideViewerOptions,
    paletteModule,
    PreRenderedElement,
    PreRenderedView,
    routingModule,
    SGraphView,
    SLabel,
    SRoutingHandle,
    SRoutingHandleView,
    toolFeedbackModule,
    toolsModule,
    TYPES,
    validationModule,
    viewportModule,
    zorderModule
} from '@eclipse-glsp/client';
import { Container, ContainerModule } from 'inversify';

import ivyDecorationModule from './decorator/di.config';
import { ActivityNode, Edge, EventNode, TaskNode } from './model';
import ivySmartActionModule from './smart-action/di.config';
import {
    AssociationEdgeView,
    EventNodeView,
    EventTaskNodeView,
    ForeignLabelView,
    ForkOrJoinNodeView,
    TaskNodeView,
    WorkflowEdgeView
} from './workflow-views';

const ivyDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
    bind(TYPES.ISnapper).to(GridSnapper);
    bind(TYPES.IContextMenuItemProvider).to(DeleteElementContextMenuItemProvider);
    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, 'graph', GLSPGraph, SGraphView);
    // configureModelElement(context, 'node', RectangularNode, RectangularNodeView);
    configureModelElement(context, 'event:start', EventNode, EventNodeView);
    configureModelElement(context, 'event:start:error', EventNode, EventNodeView);
    configureModelElement(context, 'event:start:signal', EventNode, EventNodeView);
    configureModelElement(context, 'event:end', EventNode, EventNodeView);
    configureModelElement(context, 'event:end:error', EventNode, EventNodeView);
    configureModelElement(context, 'event:task', EventNode, EventTaskNodeView);
    configureModelElement(context, 'event:boundary:error', EventNode, EventTaskNodeView);
    configureModelElement(context, 'event:boundary:signal', EventNode, EventTaskNodeView);
    configureModelElement(context, 'activity:alternative', ActivityNode, ForkOrJoinNodeView);
    configureModelElement(context, 'activity:gateway', ActivityNode, ForkOrJoinNodeView);
    configureModelElement(context, 'node', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:comment', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:script', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:hd', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:user', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:soap', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:rest', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:db', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:email', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:subproc', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:embeddedproc', TaskNode, TaskNodeView);
    configureModelElement(context, 'edge', Edge, WorkflowEdgeView);
    configureModelElement(context, 'edge:association', Edge, AssociationEdgeView);
    configureModelElement(context, 'label', SLabel, ForeignLabelView);
    configureModelElement(context, 'html', HtmlRoot, HtmlRootView);
    configureModelElement(context, 'pre-rendered', PreRenderedElement, PreRenderedView);
    configureModelElement(context, 'routing-point', SRoutingHandle, SRoutingHandleView);
    configureModelElement(context, 'volatile-routing-point', SRoutingHandle, SRoutingHandleView);
});

export default function createContainer(widgetId: string): Container {
    const container = new Container();

    container.load(validationModule, defaultModule, glspMouseToolModule, defaultGLSPModule, glspSelectModule, boundsModule, viewportModule, toolsModule,
        glspHoverModule, fadeModule, exportModule, expandModule, buttonModule, modelSourceModule,
        ivyDiagramModule, toolFeedbackModule, modelHintsModule, glspServerCopyPasteModule, paletteModule, routingModule, ivyDecorationModule, edgeLayoutModule, zorderModule,
        layoutCommandsModule, ivySmartActionModule, glspContextMenuModule);

    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + '_hidden',
        needsClientLayout: true
    });

    return container;
}
