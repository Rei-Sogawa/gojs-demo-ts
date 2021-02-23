import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';

import './DiagramWrapper.css';

interface WrapperProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export default class DiagramWrapper extends React.Component<WrapperProps, {}> {
  private diagramRef: React.RefObject<ReactDiagram>;

  constructor(props: WrapperProps) {
    super(props);
    this.diagramRef = React.createRef();
  }

  public componentDidMount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  public componentWillUnmount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.removeDiagramListener(
        'ChangedSelection',
        this.props.onDiagramEvent
      );
    }
  }

  private initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
      'undoManager.isEnabled': true,
      'clickCreatingTool.archetypeNodeData': {
        text: 'new node',
        color: 'lightblue',
      },
      model: $(go.GraphLinksModel, {
        linkKeyProperty: 'key',
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
        makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
          let k = data.key || -1;
          while (m.findNodeDataForKey(k)) k--;
          data.key = k;
          return k;
        },
      }),
    });

    diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(go.Shape, 'RoundedRectangle', {
        name: 'SHAPE',
        fill: 'white',
        strokeWidth: 0,
        portId: '',
        fromLinkable: true,
        toLinkable: true,
        cursor: 'pointer',
      }),
      $(
        go.TextBlock,
        { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' },
        new go.Binding('text').makeTwoWay()
      )
    );

    diagram.linkTemplate = $(
      go.Link,
      new go.Binding('relinkableFrom', 'canRelink').ofModel(),
      new go.Binding('relinkableTo', 'canRelink').ofModel(),
      $(go.Shape),
      $(go.Shape, { toArrow: 'Standard' })
    );

    return diagram;
  }

  public render() {
    return (
      <ReactDiagram
        ref={this.diagramRef}
        divClassName="diagram-component"
        initDiagram={this.initDiagram}
        nodeDataArray={this.props.nodeDataArray}
        linkDataArray={this.props.linkDataArray}
        modelData={this.props.modelData}
        onModelChange={this.props.onModelChange}
        skipsDiagramUpdate={this.props.skipsDiagramUpdate}
      />
    );
  }
}
