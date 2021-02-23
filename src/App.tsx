import * as go from 'gojs';
import * as React from 'react';

import DiagramWrapper from './DiagramWrapper';

interface AppState {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  selectedKey: number | null;
  skipsDiagramUpdate: boolean;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      nodeDataArray: [
        { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
        { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
        { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
        { key: 3, text: 'Delta', color: 'pink', loc: '150 150' },
      ],
      linkDataArray: [
        { key: -1, from: 0, to: 1 },
        { key: -2, from: 0, to: 2 },
        { key: -3, from: 1, to: 1 },
        { key: -4, from: 2, to: 3 },
        { key: -5, from: 3, to: 0 },
      ],
      modelData: {
        canRelink: true,
      },
      selectedKey: null,
      skipsDiagramUpdate: false,
    };
    this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleRelinkChange = this.handleRelinkChange.bind(this);
  }

  public handleDiagramEvent(e: go.DiagramEvent) {
    const name = e.name;
    switch (name) {
      case 'ChangedSelection': {
        const sel = e.subject.first();
        if (sel) {
          this.setState({ selectedKey: sel.key });
        } else {
          this.setState({ selectedKey: null });
        }
        break;
      }
      default:
        break;
    }
  }

  public handleModelChange(obj: go.IncrementalData) {
    const insertedNodeKeys = obj.insertedNodeKeys;
    const modifiedNodeData = obj.modifiedNodeData;
    const removedNodeKeys = obj.removedNodeKeys;
    const insertedLinkKeys = obj.insertedLinkKeys;
    const modifiedLinkData = obj.modifiedLinkData;
    const removedLinkKeys = obj.removedLinkKeys;
    const modifiedModelData = obj.modelData;

    console.log(obj);
  }

  public handleRelinkChange(e: any) {
    const target = e.target;
    const value = target.checked;
    this.setState({
      modelData: { canRelink: value },
      skipsDiagramUpdate: false,
    });
  }

  public render() {
    let selKey;
    if (this.state.selectedKey !== null) {
      selKey = <p>Selected Key: {this.state.selectedKey}</p>;
    }

    return (
      <div style={{ width: 720, margin: '0 auto' }}>
        <DiagramWrapper
          nodeDataArray={this.state.nodeDataArray}
          linkDataArray={this.state.linkDataArray}
          modelData={this.state.modelData}
          skipsDiagramUpdate={this.state.skipsDiagramUpdate}
          onDiagramEvent={this.handleDiagramEvent}
          onModelChange={this.handleModelChange}
        />
        <label>
          Allow Relinking?
          <input
            type="checkbox"
            id="relink"
            checked={this.state.modelData.canRelink}
            onChange={this.handleRelinkChange}
          />
        </label>
        {selKey}
      </div>
    );
  }
}
