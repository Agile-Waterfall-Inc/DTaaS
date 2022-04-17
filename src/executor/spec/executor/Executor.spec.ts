import { Dataflow, DataflowInput, Edge, Node } from '../../source/Dataflow'
import { execute } from '../../source/executor/Executor'
import { HttpInputNode } from '../../source/executor/nodes/HttpInputNode'
import { HttpOutputNode } from '../../source/executor/nodes/HttpOutputNode'
import * as Linearization from './../../source/executor/Linearization'
import * as Web from './../../source/request/WebRequest'

const linearizationSpy = jest.spyOn( Linearization, 'linearize' )
const webRequest = jest.spyOn( Web, 'webRequest' ).mockResolvedValue( { status: 200 } )

const httpInputNode: Node<HttpInputNode> = {
  id: '1',
  type: 'httpIn',
  data: {
    outgoingHandles: [{ name: 'a', id: 'a' }],
    incomingHandles: [],
    params: {
      method: 'POST'
    }
  }
}

const httpOutputNode: Node<HttpOutputNode> = {
  id: '2',
  type: 'httpOut',
  data: {
    outgoingHandles: [],
    incomingHandles: [{ name: 'b', id: 'b' }],
    params: {
      url: 'http://localhost:8080/xyz',
      method: 'POST',
      header: {},
      body: {}
    }
  },
}

describe( 'Executor', () => {
  it( 'should execute an empty data flow', async () => {

    const dataFlow: Dataflow = {
      nodes: [],
      edges: []
    }
    const input: DataflowInput = {
      method: 'GET',
      query: '',
      body: {}
    }

    const result = await execute( dataFlow, input )

    expect( linearizationSpy ).toBeCalledWith( dataFlow )
    expect( result ).toBeUndefined()
  } )

  it( 'should execute a data flow with only a single input node', async () => {
    const dataFlow: Dataflow = {
      nodes: [httpInputNode],
      edges: []
    }
    const input: DataflowInput = {
      method: 'POST',
      query: '',
      body: { hello: 'world' }
    }

    const result = await execute( dataFlow, input )

    expect( linearizationSpy ).toBeCalledWith( dataFlow )
    expect( result ).not.toBeUndefined()
    expect( result[httpInputNode.id] ).toBe( input.body )
  } )

  it( 'should execute a data flow with input and output node', async () => {
    const edge: Edge = {
      id: 'EDGE 1',
      fromNode: '1',
      toNode: '2',
      fromHandle: 'a',
      toHandle: 'b'
    }

    const dataFlow: Dataflow = {
      nodes: [httpInputNode, httpOutputNode],
      edges: [edge]
    }
    const input: DataflowInput = {
      method: 'POST',
      query: '',
      body: { hello: 'world' }
    }

    const result = await execute( dataFlow, input )

    expect( linearizationSpy ).toBeCalledWith( dataFlow )
    expect( result ).not.toBeUndefined()
    expect( result[httpInputNode.id] ).toBe( input.body )
    expect( webRequest ).toBeCalledWith( {
      'body': {},
      'data': input.body,
      'header': {},
      'method': 'POST',
      'url': 'http://localhost:8080/xyz',
    } )
  } )

  it( 'should nod execute anything for an unknown node type', async () => {

    const nodeWithWrongType: Node<any> = {
      id: '1',
      // @ts-ignore
      type: 'WRONG',
      data: {
        outgoingHandles: [{ name: 'a', id: 'a' }],
        incomingHandles: [],
        params: {}
      }
    }

    const dataFlow: Dataflow = {
      nodes: [nodeWithWrongType],
      edges: []
    }
    const input: DataflowInput = {
      method: 'POST',
      query: '',
      body: { hello: 'world' }
    }

    const result = await execute( dataFlow, input )

    expect( linearizationSpy ).toBeCalledWith( dataFlow )
    expect( result ).not.toBeUndefined()
    expect( result[httpInputNode.id] ).toBe( undefined )
  } )
} )