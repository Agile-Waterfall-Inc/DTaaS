import { CloudUploadIcon, DotsHorizontalIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import ReactFlow, { useNodesState, MiniMap, Controls, Node as ReactFlowNode, Edge as ReactFlowEdge, useEdgesState, addEdge, updateEdge } from 'react-flow-renderer/nocss'
import { Button } from '../../components/form/button'
import { FilterNode } from '../../components/graph/filter-node'
import { HttpInputNode } from '../../components/graph/http-input-node'
import { HttpOutputNode } from '../../components/graph/http-output-node'
import { Message, MessageType } from '../../components/message'
import { PageTitle } from '../../components/page-title'
import { toReactFlowEdge } from '../../helper/edges'

const Background = dynamic( () => import( 'react-flow-renderer/nocss' ).then( ( mod ): any => mod.Background ), { ssr: false } )

const nodeTypes = {
  httpIn: HttpInputNode,
  httpOut: HttpOutputNode,
  filter: FilterNode,
}

const DataFlowOverview = ( { flow }: any ): JSX.Element => {

  const [nodes, _, onNodesChange] = useNodesState<ReactFlowNode[]>( flow.nodes )
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge[]>( flow.edges )

  const onConnect = useCallback(
    ( connection ) => setEdges( ( eds: any ) => addEdge( { ...connection, animated: true }, eds ) ),
    [setEdges]
  )

  const onEdgeUpdate = ( oldEdge: any, newConnection: any ): any => setEdges( ( els ) => updateEdge( oldEdge, newConnection, els ) )

  const [isSaveDisabled, setIsSaveDisabled] = useState( false )
  const [isSaving, setIsSaving] = useState( false )
  const [message, setMessage] = useState<Message>()

  const save = async (): Promise<void> => {
    setIsSaving( true )
    setIsSaveDisabled( true )

    try {
      const response = await fetch( '/api/flows/save', {
        method: 'POST',
        body: JSON.stringify( {
          ...flow,
          nodes: nodes,
          edges: edges,
        } )
      } )

      if ( !response.ok ) {
        throw 'Failed to save data flow.'
      }

      const payload = await response.json()
      console.log( payload )
      setMessage( { text: 'Saved Data Flow', type: MessageType.Info } )
    } catch ( e: any ) {
      console.error( e )
      setMessage( { text: e?.toString(), type: MessageType.Error } )
    } finally {
      setIsSaving( false )
      setIsSaveDisabled( false )
      setTimeout( () => {
        setMessage( undefined )
      }, 1500 )
    }
  }

  return (
    <>
      <Head>
        <title>Flooq | {flow.name}</title>
      </Head>
      <PageTitle name={flow.name} message={message}>
        <Button
          disabled={isSaveDisabled}
          onClick={save}
        >
          <div className="flex gap-2 justify-between items-center">
            {isSaving ? <DotsHorizontalIcon className="w-5 h-5" /> : <CloudUploadIcon className="w-5 h-5" />}
            Save
          </div>
        </Button>
      </PageTitle>
      <main>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          snapToGrid={true}
          snapGrid={[15, 15]}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </main>
    </>
  )
}

export const getServerSideProps = async ( context: any ): Promise<any> => {
  const res = await fetch( `${process.env.BASE_URL}/api/flows/${context.query.id}` )
  const flow = await res.json()

  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      flow: {
        ...flow,
        edges: flow.edges.map( toReactFlowEdge )
      }
    }
  }
}


export default DataFlowOverview
